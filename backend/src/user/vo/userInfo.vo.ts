import { Transform } from 'class-transformer';
import  moment from 'moment';
import { PermissionEntity } from '../entities/permission.entity';
import { RoleEntity } from '../entities/role.entity';
export const tranformRoles = (roles: RoleEntity[]) => {
  return roles.map((role) => role.id);
};
export const transformPermission = (roles: RoleEntity[]) => {
  return roles.reduce(
    (pre, cur) => [
      ...pre,
      ...cur.permissions.filter(
        (item) =>
          // deduplicate permissions by code
          pre.findIndex((preItem) => item.code === preItem.code) === -1,
      ),
    ],
    [],
  );
};
export class UserDetailVo {
  id: number;

  username: string;

  nickName: string;

  email: string;

  avatar: string;

  phone: string;

  isFrozen: boolean;

  isAdmin: boolean;

  @Transform(({ value }) =>
    value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null,
  )
  createTime: string;

  @Transform(({ value }) =>
    value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null,
  )
  updateTime: string;

  @Transform(({ value }) => tranformRoles(value))
  roles: number[];

  @Transform(({ value }) => transformPermission(value))
  permissions: PermissionEntity[];
}
