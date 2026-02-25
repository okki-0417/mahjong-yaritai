"use client";

import { fetchMeAction } from "@/src/actions/fetchMeAction";
import { updateMeAction } from "@/src/actions/updateMeAction";
import Modal from "@/src/components/Modal";
import useToast from "@/src/hooks/useToast";
import { User } from "@/src/types/components";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type ProfileEditFormInputs = {
  name: string;
  profile_text: string;
  avatar: File | null;
};

export default function ProfileEditModal({ isOpen, onClose }: Props) {
  const [profile, setProfile] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const previousImageUrlRef = useRef<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileEditFormInputs>({
    defaultValues: {
      name: "",
      profile_text: "",
      avatar: null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      startTransition(async () => {
        const result = await fetchMeAction();
        setProfile(result.data);
        if (result.data) {
          reset({
            name: result.data.name,
            profile_text: result.data.profile_text || "",
            avatar: null,
          });
        }
      });
    } else {
      setImageUrl(null);
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<ProfileEditFormInputs> = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("profile_text", data.profile_text);

    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    const result = await updateMeAction(formData);

    if (result.errors) {
      result.errors.forEach((error) => {
        setError("name", { type: "manual", message: error });
        setError("profile_text", { type: "manual", message: error });
        setError("avatar", { type: "manual", message: error });
      });
      return;
    }

    toast({
      title: "プロフィールを更新しました",
      status: "success",
    });
    router.refresh();
    onClose();
  };

  const updateImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return null;

    if (previousImageUrlRef.current) {
      URL.revokeObjectURL(previousImageUrlRef.current);
    }

    const url = URL.createObjectURL(files[0]);
    previousImageUrlRef.current = url;

    setImageUrl(url);
    return files[0];
  };

  const handleClose = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "変更が保存されていません。閉じてもよろしいですか？",
      );
      if (!confirmed) return;
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="450px" height="82vh">
      <p className="text-xl">プロフィール編集</p>

      <div className="mt-2">
        {isPending || !profile ? (
          <p>読み込み中...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-stretch gap-2">
              <div className="flex flex-col gap-2 items-center">
                <div className="size-54 rounded-full overflow-hidden border-2 border-secondary-light flex justify-center items-center">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    style={{
                      backgroundImage: `url(${imageUrl || profile?.avatar_url || "/no-image.webp"})`,
                    }}
                    className="w-full h-full bg-cover bg-center hover:opacity-70"
                  />
                </div>
              </div>

              <Controller
                control={control}
                name="avatar"
                render={({ field: { onChange, ref } }) => (
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                    ref={(element) => {
                      ref(element);
                      imageInputRef.current = element;
                    }}
                    onChange={(event) => {
                      const file = updateImage(event);
                      onChange(file);
                    }}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                )}
              />
              <span className="text-sm text-red-200">
                {errors.avatar?.message ? String(errors.avatar?.message) : ""}
              </span>

              <input
                type="text"
                placeholder={profile?.name}
                className="p-2 rounded-sm border w-full"
                maxLength={20}
                {...register("name")}
                disabled={isSubmitting}
              />
              <span className="text-sm text-red-200">
                {errors.name?.message}
              </span>

              <textarea
                className="p-2 rounded-sm text-sm border w-full"
                maxLength={500}
                placeholder="自己紹介"
                rows={10}
                {...register("profile_text")}
                disabled={isSubmitting}
              />
              <span className="text-sm text-red-200">
                {errors.profile_text?.message}
              </span>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="py-2 px-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-sm text-neutral"
                >
                  {isSubmitting ? "更新中..." : "更新"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
