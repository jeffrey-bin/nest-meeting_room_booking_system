import { nanoid } from '@yoimiya/utils';
import axios, { AxiosError } from 'axios';
import type {
  AxiosResponse,
  CancelTokenSource,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import axiosRetry from 'axios-retry';
import { BACKEND_ERROR_CODE, REQUEST_ID_KEY } from './constant';
import {
  createAxiosConfig,
  createDefaultOptions,
  createRetryOptions,
} from './options';
import type {
  CustomAxiosRequestConfig,
  FlatRequestInstance,
  MappedType,
  RequestInstance,
  RequestOption,
  ResponseType,
} from './type';

function createCommonRequest<ResponseData>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>,
) {
  const opts = createDefaultOptions<ResponseData>(options);

  const axiosConf = createAxiosConfig(axiosConfig);
  const instance = axios.create(axiosConf);

  const cancelTokenSourceMap = new Map<string, CancelTokenSource>();

  // config axios retry
  const retryOptions = createRetryOptions(axiosConf);
  axiosRetry(instance, retryOptions);

  instance.interceptors.request.use((conf) => {
    const config: InternalAxiosRequestConfig = { ...conf };

    // set request id
    const requestId = nanoid();
    config.headers.set(REQUEST_ID_KEY, requestId);

    // config cancel token
    const cancelTokenSource = axios.CancelToken.source();
    config.cancelToken = cancelTokenSource.token;
    cancelTokenSourceMap.set(requestId, cancelTokenSource);

    // handle config by hook
    const handledConfig = opts.onRequest?.(config) || config;

    return handledConfig;
  });

  instance.interceptors.response.use(
    async (response) => {
      if (opts.isBackendSuccess(response)) {
        return response;
      }

      const fail = await opts.onBackendFail(response, instance);
      if (fail) {
        return fail;
      }

      const backendError = new AxiosError<ResponseData>(
        'the backend request error',
        BACKEND_ERROR_CODE,
        response.config,
        response,
        response.request,
      );

      await opts.onError(backendError);

      throw backendError;
    },
    async (error: AxiosError<ResponseData>) => {
      await opts.onError(error);

      throw error;
    },
  );

  function cancelRequest(requestId: string) {
    const cancelTokenSource = cancelTokenSourceMap.get(requestId);
    if (cancelTokenSource) {
      cancelTokenSource.cancel();
      cancelTokenSourceMap.delete(requestId);
    }
  }

  function cancelAllRequest() {
    cancelTokenSourceMap.forEach((cancelTokenSource) => {
      cancelTokenSource.cancel();
    });
    cancelTokenSourceMap.clear();
  }

  return {
    cancelAllRequest,
    cancelRequest,
    instance,
    opts,
  };
}

/**
 * create a request instance
 *
 * @param axiosConfig axios config
 * @param options request options
 */
export function createRequest<ResponseData>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>,
) {
  const { cancelAllRequest, cancelRequest, instance, opts } =
    createCommonRequest<ResponseData>(axiosConfig, options);

  const request: RequestInstance = async function request<
    T,
    R extends ResponseType = 'json',
  >(config: CustomAxiosRequestConfig) {
    const response: AxiosResponse<ResponseData> = await instance(config);

    const responseType = response.config?.responseType || 'json';

    if (responseType === 'json') {
      return opts.transformBackendResponse(response);
    }

    return response.data as MappedType<R, T>;
  } as RequestInstance;

  request.cancelRequest = cancelRequest;
  request.cancelAllRequest = cancelAllRequest;

  return request;
}

/**
 * create a flat request instance
 *
 * The response data is a flat object: { data: any, error: AxiosError }
 *
 * @param axiosConfig axios config
 * @param options request options
 */
export function createFlatRequest<ResponseData>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>,
) {
  const { cancelAllRequest, cancelRequest, instance, opts } =
    createCommonRequest<ResponseData>(axiosConfig, options);

  const flatRequest: FlatRequestInstance = async function flatRequest<
    T,
    R extends ResponseType = 'json',
  >(config: CustomAxiosRequestConfig) {
    try {
      const response: AxiosResponse<ResponseData> = await instance(config);

      const responseType = response.config?.responseType || 'json';

      if (responseType === 'json') {
        const data = opts.transformBackendResponse(response);

        return { data, error: null };
      }

      return { data: response.data as MappedType<R, T>, error: null };
    } catch (error) {
      return { data: null, error };
    }
  } as FlatRequestInstance;

  flatRequest.cancelRequest = cancelRequest;
  flatRequest.cancelAllRequest = cancelAllRequest;

  return flatRequest;
}

export { BACKEND_ERROR_CODE, REQUEST_ID_KEY };
export type * from './type';
export type { CreateAxiosDefaults, AxiosError };
