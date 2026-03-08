import Modal from "@/src/components/Modal";
import PopButton from "@/src/components/PopButton";
import TileImage from "@/src/components/TileImage";
import { useDisclosure } from "@/src/hooks/useDisclosure";
import { WhatToDiscardProblem } from "@/src/types/components";
import {
  CreateWhatToDiscardProblemForm,
  UpdateWhatToDiscardProblemForm,
} from "@/src/types/forms";
import { ReactNode, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const MAX_TURN = 18;
const ALL_TILES_NUM = 34;
const handFieldNames = [
  "hand1_id",
  "hand2_id",
  "hand3_id",
  "hand4_id",
  "hand5_id",
  "hand6_id",
  "hand7_id",
  "hand8_id",
  "hand9_id",
  "hand10_id",
  "hand11_id",
  "hand12_id",
  "hand13_id",
] as const;

const tileFieldNames = [...handFieldNames, "tsumo_id", "dora_id"] as const;

type ProblemFormInputs =
  | CreateWhatToDiscardProblemForm
  | UpdateWhatToDiscardProblemForm;

export default function useProblemForm(problem?: WhatToDiscardProblem) {
  const [currentFocussedTileField, setCurrentFocussedTileField] =
    useState<(typeof tileFieldNames)[number]>("hand1_id");
  const [isShowingDetail, setIsShowingDetail] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
    reset,
    resetField,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ProblemFormInputs>({
    defaultValues: {
      hand1_id: problem?.hand1_id,
      hand2_id: problem?.hand2_id,
      hand3_id: problem?.hand3_id,
      hand4_id: problem?.hand4_id,
      hand5_id: problem?.hand5_id,
      hand6_id: problem?.hand6_id,
      hand7_id: problem?.hand7_id,
      hand8_id: problem?.hand8_id,
      hand9_id: problem?.hand9_id,
      hand10_id: problem?.hand10_id,
      hand11_id: problem?.hand11_id,
      hand12_id: problem?.hand12_id,
      hand13_id: problem?.hand13_id,
      dora_id: problem?.dora_id,
      tsumo_id: problem?.tsumo_id,
      round: problem?.round,
      turn: problem?.turn || null,
      wind: problem?.wind,
      points: problem?.points ? Number(problem.points) : null,
      description: problem?.description,
    },
  });

  const tileFieldErrors = [
    errors?.hand1_id,
    errors?.hand2_id,
    errors?.hand3_id,
    errors?.hand4_id,
    errors?.hand5_id,
    errors?.hand6_id,
    errors?.hand7_id,
    errors?.hand8_id,
    errors?.hand9_id,
    errors?.hand10_id,
    errors?.hand11_id,
    errors?.hand12_id,
    errors?.hand13_id,
    errors?.tsumo_id,
    errors?.dora_id,
  ];

  const handleTileSelected = (tileId: string) => {
    setValue(currentFocussedTileField, Number(tileId));

    const nextFocussedTileField = tileFieldNames.find(
      (name) => Boolean(getValues(name)) == false,
    );
    if (nextFocussedTileField)
      setCurrentFocussedTileField(nextFocussedTileField);
  };

  const handleTileSelectionReset = () => {
    tileFieldNames.map((fieldName) => resetField(fieldName));
    setCurrentFocussedTileField("hand1_id");
  };

  const TileDisplay = ({
    fieldName,
  }: {
    fieldName: typeof currentFocussedTileField;
  }) => {
    return (
      <div>
        <input
          type="hidden"
          {...register(fieldName, {
            required: "すべての牌を選択してください",
          })}
          readOnly
        />
        <button
          type="button"
          onClick={() => setCurrentFocussedTileField(fieldName)}
          className={`h-12 aspect-tile border rounded-sm ${
            currentFocussedTileField == fieldName
              ? "border-blue-500 shadow shadow-blue-500"
              : "border-secondary"
          }`}
        >
          {watch(fieldName) && (
            <TileImage tileId={Number(getValues(fieldName))} hover={false} />
          )}
        </button>
      </div>
    );
  };

  const BaseForm = ({
    onSubmit,
  }: {
    onSubmit: SubmitHandler<ProblemFormInputs>;
  }) => (
    <form
      onSubmit={() => {
        onClose();
        handleSubmit(onSubmit)();
      }}
      className="bg-neutral text-primary"
    >
      <div className="flex flex-col gap-6">
        {errors.root?.message && (
          <p className="text-red-500">{errors.root.message}</p>
        )}
        <fieldset className={tileFieldErrors.some(Boolean) ? "form-error" : ""}>
          <div className="flex flex-col items-start gap-2">
            {tileFieldErrors.some(Boolean) && (
              <p className="text-red-500 text-sm">
                {tileFieldErrors.find(Boolean)?.message}
              </p>
            )}

            <div>
              <div>
                <label>
                  手牌<span className="text-red-500 ml-1">*</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-px mt-2">
                {handFieldNames.map((fieldName, index) => (
                  <TileDisplay key={index} fieldName={fieldName} />
                ))}
              </div>
            </div>

            <div className="flex gap-px">
              <div className="flex flex-col items-center">
                <label className="text-sm">ツモ</label>

                <TileDisplay fieldName="tsumo_id" />
              </div>

              <div className="flex flex-col items-center">
                <label className="text-sm">ドラ</label>

                <TileDisplay fieldName="dora_id" />
              </div>
            </div>

            <button
              className="px-3 py-1 rounded-sm border hover:bg-gray-200"
              onClick={handleTileSelectionReset}
            >
              <span className="text-sm">牌をリセット</span>
            </button>
          </div>

          <hr className="border border-black border-dashed mt-6" />

          <div className="mt-6">
            <p className="text-sm">牌をクリックして選ぶ</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {Array.from({ length: ALL_TILES_NUM }).map((_, index) => {
                const tileId = String(index + 1);
                return (
                  <div className="flex flex-col items-center" key={index}>
                    <PopButton
                      onClick={() => handleTileSelected(tileId)}
                      className="h-12 aspect-7/9 border border-primary rounded-sm"
                    >
                      <TileImage tile={tileId} hover={false} />
                    </PopButton>
                  </div>
                );
              })}
            </div>
          </div>
        </fieldset>

        <button
          type="button"
          onClick={() => setIsShowingDetail((prev) => !prev)}
          className="w-full text-sm py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-sm text-gray-700 "
        >
          詳細設定
        </button>

        <div className="flex flex-col">
          <div>
            <textarea
              {...register("description")}
              placeholder="コメントを追加..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div
          className={`flex flex-col gap-6 ${isShowingDetail ? "block" : "hidden"}`}
        >
          <fieldset className={errors.round ? "form-error" : ""}>
            <div className="flex flex-col items-start gap-2">
              <label className="text-lg font-medium">局数</label>
              <input type="hidden" {...register("round")} readOnly />
              {errors.round && (
                <p className="text-red-500 text-sm">{errors.round?.message}</p>
              )}
              <DisplayInput>
                {watch("round") && `${watch("round")}局`}
              </DisplayInput>

              <div className="flex flex-wrap gap-2">
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
                  return (
                    <PopButton
                      key={index}
                      onClick={() => setValue("round", roundName)}
                      className="form-button"
                    >
                      <span className="text-lg">{roundName}</span>
                    </PopButton>
                  );
                })}
              </div>

              <PopButton
                className="form-button"
                onClick={() => setValue("round", null)}
              >
                <span className="text-lg">局数をリセット</span>
              </PopButton>
            </div>
          </fieldset>

          <fieldset className={errors.turn ? "form-error" : ""}>
            <div className="flex flex-col items-start gap-2">
              <label className="text-lg font-medium">巡目</label>
              {errors.turn && (
                <p className="text-red-500 text-sm">{errors.turn?.message}</p>
              )}
              <input type="hidden" {...register("turn")} readOnly />
              <DisplayInput>
                {watch("turn") && `${getValues("turn")}巡目`}
              </DisplayInput>

              <div className="flex flex-wrap gap-2">
                {Array.from({ length: MAX_TURN }).map((_, index) => {
                  const turn = index + 1;
                  return (
                    <PopButton
                      onClick={() => setValue("turn", turn)}
                      className="form-button"
                      key={index}
                    >
                      <span className="text-lg">{`${turn}巡目`}</span>
                    </PopButton>
                  );
                })}
              </div>

              <PopButton
                className="form-button"
                onClick={() => setValue("turn", null)}
              >
                <span className="text-lg">巡目をリセット</span>
              </PopButton>
            </div>
          </fieldset>

          <fieldset className={errors.wind ? "form-error" : ""}>
            <div className="flex flex-col items-start gap-2">
              <label className="text-lg font-medium">風</label>
              {errors.wind && (
                <p className="text-red-500 text-sm">{errors.wind?.message}</p>
              )}
              <input type="hidden" {...register("wind")} readOnly />
              <DisplayInput>
                {watch("wind") && `${getValues("wind")}家`}
              </DisplayInput>

              <div className="flex flex-wrap gap-2">
                {["東", "南", "西", "北"].map((windName, index) => {
                  return (
                    <PopButton
                      key={index}
                      onClick={() => setValue("wind", windName)}
                      className="form-button"
                    >
                      <span className="text-lg">{windName}</span>
                    </PopButton>
                  );
                })}
              </div>

              <PopButton
                className="form-button"
                onClick={() => setValue("wind", null)}
              >
                <span className="text-lg">風をリセット</span>
              </PopButton>
            </div>
          </fieldset>

          <fieldset className={errors.points ? "form-error" : ""}>
            <div className="flex flex-col items-start gap-2">
              <div>
                <label className="text-xl font-medium">持ち点</label>

                {errors.points && (
                  <p className="text-red-500 text-sm">
                    {errors.points?.message}
                  </p>
                )}

                <input type="hidden" {...register("points")} readOnly />

                <DisplayInput>
                  {watch("points") &&
                    new Intl.NumberFormat("en-US").format(
                      Number(watch("points")),
                    )}
                </DisplayInput>
              </div>

              <div className="flex flex-wrap gap-2">
                {[10000, 1000, 100, -10000, -1000, -100].map(
                  (addend, index) => (
                    <PopButton
                      key={index}
                      className="form-button"
                      onClick={() =>
                        setValue("points", Number(getValues("points")) + addend)
                      }
                    >
                      <span className="text-lg">
                        {`${addend > 0 ? "+" : ""} ${new Intl.NumberFormat("en-US").format(addend)}`}
                      </span>
                    </PopButton>
                  ),
                )}
              </div>

              <PopButton onClick={() => setValue("points", null)}>
                <span>得点をリセット</span>
              </PopButton>
            </div>
          </fieldset>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            disabled={!isValid || isOpen || isSubmitting}
            onClick={onOpen}
            className="px-4 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white rounded-sm"
          >
            <span>作成する</span>
          </button>
        </div>

        {isOpen && (
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            width="fit-content"
            height="fit-content"
          >
            <div className="px-8 py-3">
              <p className="text-center">これで送信しますか？</p>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-sm"
                >
                  <span>キャンセル</span>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-sm"
                >
                  <span>作成</span>
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </form>
  );

  return { BaseForm, setError, reset };
}

const DisplayInput = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`w-40 min-h-12 border border-gray-400 py-2 px-4 text-xl rounded-md bg-gray-50 ${className ?? ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
