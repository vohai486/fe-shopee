import { Button } from "@/components/common/button";
import { InputField } from "@/components/form/input-field";
import { AuthLayout } from "@/components/layouts";
import { useAuth } from "@/hooks";
import { LoginPayload } from "@/types/auth.types";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function LoginPage() {
  const { login, isLoadingLoginForm } = useAuth();
  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Không được bỏ trống")
      .email("Email không hợp lệ"),
    password: yup
      .string()
      .min(6, "Mật khẩu tối thiểu 6 kí tự")
      .required("Vui lòng nhập mật khẩu"),
  });
  const { control, handleSubmit } = useForm<LoginPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
    shouldFocusError: false,
    mode: "onChange",
  });
  const handleLoginForm = async (values: LoginPayload) => {
    await login(values);
  };
  return (
    <div className="h-full py-[100px] w-full">
      <div className="w400:flex w-full justify-center items-center ">
        <form
          onSubmit={handleSubmit(handleLoginForm)}
          className="w400:w-[400px] rounded-md border-box bg-box shadow-sm-50"
        >
          <div className="py-5 px-7 text-blue-300 dark:text-grey-0 text-xl text-center">
            Đăng nhập
          </div>
          <div className="w400:px-7 px-3 pb-5 flex flex-col gap-y-2">
            <InputField
              className="px-3 py-2 rounded-md text-sm h-11"
              name="email"
              type="text"
              control={control}
            />
            <InputField
              className="px-3 py-2 rounded-md text-sm h-11"
              name="password"
              type="password"
              control={control}
            />
            <Button isLoading={isLoadingLoginForm} label="Đăng nhập" />
            <div className="text-sm mt-3 flex justify-center gap-2">
              <span>Chưa có tài khoản?</span>
              <Link href="/signup" className="text-blue-200">
                Đăng ký
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

LoginPage.Layout = AuthLayout;
