import { Button } from "@/components/common/button";
import { InputField } from "@/components/form/input-field";
import { AuthLayout } from "@/components/layouts";
import { useAuth } from "@/hooks";
import { LoginPayload } from "@/types/auth.types";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

export default function LoginPage() {
  const { login } = useAuth();
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
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginPayload>({
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
          className="w400:w-[400px] rounded-sm shadow-md bg-white"
        >
          <div className="py-5 px-7 text-xl text-center">Đăng nhập</div>
          <div className="w400:px-7 px-3 pb-5 flex flex-col gap-y-2">
            <InputField name="email" type="text" control={control} />
            <InputField name="password" type="password" control={control} />
            <Button isLoading={isSubmitting} label="Đăng nhập" />
            <div className="text-sm mt-3 flex justify-center gap-2">
              <span className="text-gray2">Chưa có tài khoản?</span>
              <Link href="/signup" className="text-orange">
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
