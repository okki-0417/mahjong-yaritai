"use client";

import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  FormState,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { GameSessionFormType } from "@/src/app/me/participated-mahjong-sessions/new/types";
import useGetSession from "@/src/hooks/useGetSession";

export const DEFAULT_FORM_VALUES: GameSessionFormType = {
  rate: 100,
  chipAmount: 0,
  createdDate: new Date().toISOString().split("T")[0],
  participantUsers: [
    { userId: null, name: "NONAME", avatarUrl: null },
    { userId: null, name: "NONAME", avatarUrl: null },
    { userId: null, name: "NONAME", avatarUrl: null },
    { userId: null, name: "NONAME", avatarUrl: null },
  ],
  games: [
    {
      results: [
        { resultPoints: null, ranking: null },
        { resultPoints: null, ranking: null },
        { resultPoints: null, ranking: null },
        { resultPoints: null, ranking: null },
      ],
    },
  ],
};

type MahjongSessionFormContextType = {
  register: UseFormRegister<GameSessionFormType>;
  handleSubmit: UseFormHandleSubmit<GameSessionFormType>;
  control: Control<GameSessionFormType>;
  watch: UseFormWatch<GameSessionFormType>;
  setValue: UseFormSetValue<GameSessionFormType>;
  reset: UseFormReset<GameSessionFormType>;
  formState: FormState<GameSessionFormType>;
  errors: FieldErrors<GameSessionFormType>;
  participantUserFields: FieldArrayWithId<GameSessionFormType, "participantUsers", "id">[];
  appendParticipantUser: UseFieldArrayAppend<GameSessionFormType, "participantUsers">;
  removeParticipantUser: UseFieldArrayRemove;
  gameFields: FieldArrayWithId<GameSessionFormType, "games", "id">[];
  appendGame: UseFieldArrayAppend<GameSessionFormType, "games">;
  removeGame: UseFieldArrayRemove;
};

const MahjongSessionFormContext = createContext<MahjongSessionFormContextType | null>(null);

type Props = {
  children: ReactNode;
};

export default function MahjongSessionFormContextProvider({ children }: Props) {
  const { session } = useGetSession();
  const hasSetCurrentUser = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState,
    formState: { errors },
  } = useForm<GameSessionFormType>({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange",
  });

  // 初回のみ、最初の参加者を自分に設定
  useEffect(() => {
    if (hasSetCurrentUser.current) return;
    if (!session?.user) return;

    setValue("participantUsers.0", {
      userId: session.user.id,
      name: session.user.name,
      avatarUrl: session.user.avatarUrl ?? null,
    });
    hasSetCurrentUser.current = true;
  }, [session, setValue]);

  const {
    fields: participantUserFields,
    append: appendParticipantUser,
    remove: removeParticipantUser,
  } = useFieldArray({
    control,
    shouldUnregister: true,
    name: "participantUsers",
  });

  const {
    fields: gameFields,
    append: appendGame,
    remove: removeGame,
  } = useFieldArray({
    control,
    shouldUnregister: true,
    name: "games",
  });

  const value: MahjongSessionFormContextType = {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState,
    errors,
    participantUserFields,
    appendParticipantUser,
    removeParticipantUser,
    gameFields,
    appendGame,
    removeGame,
  };

  return (
    <MahjongSessionFormContext.Provider value={value}>
      {children}
    </MahjongSessionFormContext.Provider>
  );
}

export function useMahjongSessionForm() {
  const context = useContext(MahjongSessionFormContext);
  if (!context) {
    throw new Error("useMahjongSessionForm must be used within MahjongSessionFormContextProvider");
  }
  return context;
}
