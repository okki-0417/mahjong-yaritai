import { type FormEvent } from "react";

type UseNumberInputOptions = {
  min?: number;
  max?: number;
};

/**
 * 数値入力フィールド用のカスタムフック
 * 先頭のゼロを除去し、min/maxの範囲内に制限する
 *
 * @param options - min: 最小値, max: 最大値
 * @returns onInputハンドラー
 *
 * @example
 * const handleNumberInput = useNumberInput({ min: -999, max: 999 });
 * <Input type="number" onInput={handleNumberInput} />
 */
export const useNumberInput = (options?: UseNumberInputOptions) => {
  return (e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    // マイナス記号や空文字の場合はそのまま
    if (value === "-" || value === "") return;

    // 数値に変換できる場合のみ処理
    if (!isNaN(Number(value))) {
      let numValue = Number(value);

      // 最大値制限
      if (options?.max !== undefined && numValue > options.max) {
        e.currentTarget.value = String(options.max);
        return;
      }

      // 最小値制限
      if (options?.min !== undefined && numValue < options.min) {
        e.currentTarget.value = String(options.min);
        return;
      }

      // 先頭のゼロを除去（例: 0000 -> 0, 00123 -> 123）
      e.currentTarget.value = String(numValue);
    }
  };
};
