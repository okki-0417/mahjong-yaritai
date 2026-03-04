"use client";

import updateWhatToDiscardProblem from "@/src/actions/updateWhatToDiscardProblem";
import TileImage from "@/src/components/TileImage";
import useToast from "@/src/hooks/useToast";
import getTileNameById from "@/src/lib/utils/tileNameById";
import { WhatToDiscardProblem } from "@/src/types/components";
import { EditWhatToDiscardProblemForm } from "@/src/types/forms";
import { useRef } from "react";
import { useForm } from "react-hook-form";

type Props = {
  problem: WhatToDiscardProblem;
};

type FormData = EditWhatToDiscardProblemForm;

export default function WhatToDiscardProblemEditForm({ problem }: Props) {
  const selectRefs = useRef<(HTMLSelectElement | null)[]>([]);
  const tsumoSelectRef = useRef<HTMLSelectElement | null>(null);
  const doraSelectRef = useRef<HTMLSelectElement | null>(null);

  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      round: problem.round,
      turn: problem.turn,
      wind: problem.wind,
      points: problem.points,
      description: problem.description,
      dora_id: problem.dora_id,
      hand1_id: problem.hand1_id,
      hand2_id: problem.hand2_id,
      hand3_id: problem.hand3_id,
      hand4_id: problem.hand4_id,
      hand5_id: problem.hand5_id,
      hand6_id: problem.hand6_id,
      hand7_id: problem.hand7_id,
      hand8_id: problem.hand8_id,
      hand9_id: problem.hand9_id,
      hand10_id: problem.hand10_id,
      hand11_id: problem.hand11_id,
      hand12_id: problem.hand12_id,
      hand13_id: problem.hand13_id,
      tsumo_id: problem.tsumo_id,
    },
  });

  const onSubmit = async (form: FormData) => {
    try {
      await updateWhatToDiscardProblem({
        id: problem.id,
        form,
      });

      toast({
        title: "問題を更新しました",
        status: "success",
      });
    } catch (error) {
      console.error(error);
      setError("root", {
        type: "manual",
        message: "問題の更新に失敗しました",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
      {errors.root && (
        <div className="mb-4 text-red-500 text-sm">{errors.root.message}</div>
      )}

      <div className="flex flex-wrap mt-2 gap-1">
        {[
          watch("hand1_id"),
          watch("hand2_id"),
          watch("hand3_id"),
          watch("hand4_id"),
          watch("hand5_id"),
          watch("hand6_id"),
          watch("hand7_id"),
          watch("hand8_id"),
          watch("hand9_id"),
          watch("hand10_id"),
          watch("hand11_id"),
          watch("hand12_id"),
          watch("hand13_id"),
        ].map((field, index) => {
          const { ref, ...rest } = register(
            `hand${index + 1}_id` as keyof FormData,
          );
          return (
            <div key={index} className="relative">
              <button
                type="button"
                onClick={() => selectRefs.current[index]?.showPicker()}
                className="cursor-pointer hover:opacity-70"
              >
                <TileImage tileId={field} />
              </button>

              <select
                ref={(el) => {
                  ref(el);
                  selectRefs.current[index] = el;
                }}
                id={`hand${index + 1}_id`}
                {...rest}
                className="absolute opacity-0 w-px h-px top-0 left-0"
              >
                <optgroup label="萬子">
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((id) => (
                    <option key={id} value={id}>
                      {getTileNameById(id)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="筒子">
                  {Array.from({ length: 9 }, (_, i) => i + 10).map((id) => (
                    <option key={id} value={id}>
                      {getTileNameById(id)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="索子">
                  {Array.from({ length: 9 }, (_, i) => i + 19).map((id) => (
                    <option key={id} value={id}>
                      {getTileNameById(id)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="字牌">
                  {Array.from({ length: 7 }, (_, i) => i + 28).map((id) => (
                    <option key={id} value={id}>
                      {getTileNameById(id)}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-2">
        <div className="flex flex-col items-center">
          <label>ツモ</label>

          <div className="relative">
            <button
              type="button"
              onClick={() => tsumoSelectRef.current?.showPicker()}
              className="cursor-pointer hover:opacity-70"
            >
              <TileImage tileId={watch("tsumo_id")} />
            </button>

            {(() => {
              const { ref, ...rest } = register("tsumo_id");
              return (
                <select
                  ref={(el) => {
                    ref(el);
                    tsumoSelectRef.current = el;
                  }}
                  {...rest}
                  className="absolute opacity-0 w-px h-px top-0 left-0"
                >
                  <optgroup label="萬子">
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((id) => (
                      <option key={id} value={id}>
                        {getTileNameById(id)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="筒子">
                    {Array.from({ length: 9 }, (_, i) => i + 10).map((id) => (
                      <option key={id} value={id}>
                        {getTileNameById(id)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="索子">
                    {Array.from({ length: 9 }, (_, i) => i + 19).map((id) => (
                      <option key={id} value={id}>
                        {getTileNameById(id)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="字牌">
                    {Array.from({ length: 7 }, (_, i) => i + 28).map((id) => (
                      <option key={id} value={id}>
                        {getTileNameById(id)}
                      </option>
                    ))}
                  </optgroup>
                </select>
              );
            })()}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label>ドラ</label>

          <div className="relative">
            <button
              type="button"
              onClick={() => doraSelectRef.current?.showPicker()}
              className="cursor-pointer hover:opacity-70"
            >
              <TileImage tileId={watch("dora_id")} />
            </button>

            {(() => {
              const { ref, ...rest } = register("dora_id");
              return (
                <select
                  ref={(el) => {
                    ref(el);
                    doraSelectRef.current = el;
                  }}
                  {...rest}
                  className="absolute opacity-0 w-px h-px top-0 left-0"
                >
                  <optgroup label="萬子">
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((id) => (
                      <option key={id} value={id}>
                        {getTileNameById(id)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="筒子">
                    {Array.from({ length: 9 }, (_, i) => i + 10).map((id) => (
                      <option key={id} value={id}>
                        {getTileNameById(id)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="索子">
                    {Array.from({ length: 9 }, (_, i) => i + 19).map((id) => (
                      <option key={id} value={id}>
                        {getTileNameById(id)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="字牌">
                    {Array.from({ length: 7 }, (_, i) => i + 28).map((id) => (
                      <option key={id} value={id}>
                        {getTileNameById(id)}
                      </option>
                    ))}
                  </optgroup>
                </select>
              );
            })()}
          </div>
        </div>
      </div>

      <details className="mt-8">
        <summary className="cursor-pointer text-lg w-fit">詳細設定</summary>

        <div className="mt-2 flex flex-col gap-1">
          <label htmlFor="description">説明</label>
          <textarea
            {...register("description")}
            placeholder="コメント..."
            rows={5}
            className="border rounded-sm p-2"
          />
        </div>

        <div className="mt-2 flex flex-col gap-6">
          <div>
            <div className="flex flex-col items-start">
              <label htmlFor="round">局数</label>

              {errors.round && (
                <span className="text-red-500 text-sm">
                  {errors.round.message}
                </span>
              )}

              <select
                id="round"
                {...register("round")}
                className="border rounded-sm p-2"
              >
                <option value="">局数を選択する</option>
                {[
                  "東一",
                  "東二",
                  "東三",
                  "東四",
                  "南一",
                  "南二",
                  "南三",
                  "南四",
                ].map((roundName, index) => {
                  return <option key={index}>{roundName}局</option>;
                })}
              </select>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-start">
              <label htmlFor="turn">巡目</label>

              {errors.turn && (
                <span className="text-red-500 text-sm">
                  {errors.turn.message}
                </span>
              )}

              <select
                id="turn"
                className="border rounded-sm p-2"
                {...register("turn")}
              >
                <option value="">順目を選択する</option>

                {Array.from({ length: 18 }, (_, i) => i + 1).map(
                  (turnNumber) => (
                    <option key={turnNumber} value={turnNumber}>
                      {turnNumber}巡目
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-start">
              <label htmlFor="wind">風</label>
              {errors.wind && (
                <span className="text-red-500 text-sm">
                  {errors.wind.message}
                </span>
              )}

              <select
                id="wind"
                className="border rounded-sm p-2"
                {...register("wind")}
              >
                <option value="">風を選択する</option>
                {["東", "南", "西", "北"].map((windName, index) => {
                  return (
                    <option key={index} value={windName}>
                      {windName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-start">
              <label htmlFor="points">持ち点</label>

              {errors.points && (
                <span className="text-red-500 text-sm">
                  {errors.points.message}
                </span>
              )}

              <span>
                <input
                  type="number"
                  min={-30000}
                  max={100000}
                  {...register("points")}
                  className="no-spin border rounded-sm p-2"
                />
              </span>
            </div>
          </div>
        </div>
      </details>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 rounded-sm bg-pink-500 hover:opacity-70 shadow"
        >
          {isSubmitting ? "送信中..." : "作成する"}
        </button>
      </div>
    </form>
  );
}
