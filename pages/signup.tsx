import { authApi } from "@/api-client";
import { Button } from "@/components/common/button";
import { InputField } from "@/components/form/input-field";
import { AuthLayout } from "@/components/layouts";
import { SignupPayload } from "@/types/auth.types";
import { getErrorMessage } from "@/utils/get-error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
export default function SignupPage() {
  const router = useRouter();

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Không được bỏ trống")
      .email("Email không hợp lệ"),
    password: yup
      .string()
      .min(6, "Mật khẩu tối thiểu 6 kí tự")
      .required("Vui lòng nhập mật khẩu"),
    firstName: yup.string().required("Không được bỏ trống"),
    lastName: yup.string().required("Không được bỏ trống"),
    passwordConfirm: yup
      .string()
      .required("Không được bỏ trống")
      .oneOf([yup.ref("password")], "Mật khẩu phải giống nhau"),
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupPayload>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      passwordConfirm: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
    shouldFocusError: false,
  });
  const mutation = useMutation({
    mutationFn: authApi.signup,
  });
  const handleSignupForm = async (values: SignupPayload) => {
    mutation.mutate(values, {
      onSuccess: () => {
        router.push("/login");
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };
  return (
    <div className="h-full py-[100px] w-full">
      <div className="w400:flex justify-center items-center">
        <form
          onSubmit={handleSubmit(handleSignupForm)}
          className="w400:w-[400px] rounded-md border-box bg-box shadow-sm-50"
        >
          <div className="py-5 px-7 text-xl text-center text-blue-300 dark:text-grey-0">
            Đăng Ký
          </div>
          <div className="w400:px-7 px-3 pb-5 flex flex-col gap-y-2">
            <InputField placeholder="Email" name="email" control={control} />
            <div className="flex flex-col w400:flex-row gap-x-3 gap-y-2">
              <InputField placeholder="Họ" name="firstName" control={control} />
              <InputField placeholder="Tên" name="lastName" control={control} />
            </div>
            <InputField
              type="password"
              placeholder="Mật khẩu"
              name="password"
              control={control}
            />
            <InputField
              type="password"
              placeholder="Xác nhận mật khẩu"
              name="passwordConfirm"
              control={control}
            />
            <Button isLoading={isSubmitting} label="Đăng ký" />
            <div className="text-sm mt-3 flex justify-center gap-2">
              <span>Đã có tài khoản?</span>
              <Link href="/login" className="text-blue-200">
                Đăng nhập
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

SignupPage.Layout = AuthLayout;
