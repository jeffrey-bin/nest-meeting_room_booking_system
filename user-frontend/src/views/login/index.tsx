export default function LoginPage() {
  // a tailwind style user login form
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="flex w-full flex-col items-center justify-center px-4">
        <div
          className="m-4 flex w-full max-w-md flex-col rounded-lg bg-white
       p-4 shadow-md"
        >
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex w-full flex-row items-center justify-center">
              <h1 className="text-xl font-bold text-gray-900">
                会议室预定系统
              </h1>
            </div>
            <form className="flex w-full flex-col space-y-4 p-4">
              <div className="flex w-full flex-col">
                <label className="text-sm font-bold tracking-wide text-gray-700">
                  Email
                </label>
                <input
                  className="rounded-lg border px-4 py-2 text-gray-700 focus:border-green-500 focus:outline-none"
                  placeholder="Email"
                  type="email"
                />
              </div>
              <div className="flex w-full flex-col">
                <label className="text-sm font-bold tracking-wide text-gray-700">
                  Password
                </label>
                <input
                  className="rounded-lg border px-4 py-2 text-gray-700 focus:border-green-500 focus:outline-none"
                  placeholder="Password"
                  type="password"
                />
              </div>
              <div className="flex w-full flex-row justify-between">
                <div className="flex items-center justify-center text-gray-700">
                  创建账号
                </div>
                <div className="flex items-center justify-center text-gray-700">
                  忘记密码
                </div>
              </div>
              <div className="flex w-full flex-row">
                <button className="w-full  rounded-lg bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:bg-green-700 focus:outline-none">
                  登录
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
