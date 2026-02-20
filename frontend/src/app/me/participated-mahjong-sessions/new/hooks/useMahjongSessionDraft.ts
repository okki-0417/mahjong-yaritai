"use client";

import { useCallback, useEffect, useRef, useTransition } from "react";
import { UseFormReset, UseFormWatch } from "react-hook-form";
import { useToast } from "@chakra-ui/react";
import { GameSessionFormType } from "@/src/app/me/participated-mahjong-sessions/new/types";
import { DEFAULT_FORM_VALUES } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";

const DRAFT_STORAGE_KEY = "draft-mahjong-session";
const DEBOUNCE_MS = 1000;

type Props = {
  watch: UseFormWatch<GameSessionFormType>;
  reset: UseFormReset<GameSessionFormType>;
};

export default function useMahjongSessionDraft({ watch, reset }: Props) {
  const toast = useToast();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRestoredRef = useRef(false);
  const [isResetting, startResetTransition] = useTransition();

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  }, []);

  const resetAll = useCallback(() => {
    startResetTransition(() => {
      reset({
        ...DEFAULT_FORM_VALUES,
        createdDate: new Date().toISOString().split("T")[0],
      });
      toast({ title: "フォームをリセットしました", status: "info" });
    });
  }, [reset, toast]);

  // ドラフト復元（初回のみ）
  useEffect(() => {
    if (isRestoredRef.current) return;
    isRestoredRef.current = true;

    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (draft) {
      const shouldRestore = window.confirm("前回の入力内容があります。復元しますか？");
      if (shouldRestore) {
        try {
          const parsed = JSON.parse(draft) as GameSessionFormType;
          reset(parsed);
          toast({ title: "下書きを復元しました", status: "info" });
        } catch {
          clearDraft();
        }
      } else {
        clearDraft();
      }
    }
  }, [reset, toast, clearDraft]);

  // デフォルト値かどうか判定（createdDateは除外）
  const isDefaultValue = useCallback((data: Partial<GameSessionFormType>) => {
    /* eslint-disable-next-line no-unused-vars */
    const { createdDate: _, ...dataWithoutDate } = data;
    /* eslint-disable-next-line no-unused-vars */
    const { createdDate: __, ...defaultWithoutDate } = DEFAULT_FORM_VALUES;
    return JSON.stringify(dataWithoutDate) === JSON.stringify(defaultWithoutDate);
  }, []);

  // フォーム変更時に自動保存（debounce付き）
  useEffect(() => {
    const subscription = watch((data: Partial<GameSessionFormType>) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        // デフォルト値の場合は保存しない
        if (isDefaultValue(data)) {
          clearDraft();
          return;
        }
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
      }, DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [watch, isDefaultValue, clearDraft]);

  return { clearDraft, resetAll, isResetting };
}
