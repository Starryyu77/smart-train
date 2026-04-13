"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

type StudentCheckInFormProps = {
  studentId: string;
  initialValues: {
    sleep: number;
    soreness: number;
    adherence: number;
    painText: string;
    note: string;
  };
};

export function StudentCheckInForm({ studentId, initialValues }: StudentCheckInFormProps) {
  const router = useRouter();
  const [sleep, setSleep] = useState(initialValues.sleep);
  const [soreness, setSoreness] = useState(initialValues.soreness);
  const [adherence, setAdherence] = useState(initialValues.adherence);
  const [painText, setPainText] = useState(initialValues.painText);
  const [note, setNote] = useState(initialValues.note);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/student-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        sleep,
        soreness,
        adherence,
        painText,
        note,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(payload?.message ?? "提交失败，请再试一次。");
      return;
    }

    startTransition(() => {
      router.push("/student/submitted");
      router.refresh();
    });
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <label className="feedback-field">
        <div className="feedback-field__top">
          <span>睡眠</span>
          <strong>{sleep}/10</strong>
        </div>
        <input
          className="feedback-slider"
          max="10"
          min="1"
          onChange={(event) => setSleep(Number(event.target.value))}
          type="range"
          value={sleep}
        />
      </label>

      <label className="feedback-field">
        <div className="feedback-field__top">
          <span>酸痛</span>
          <strong>{soreness}/10</strong>
        </div>
        <input
          className="feedback-slider"
          max="10"
          min="1"
          onChange={(event) => setSoreness(Number(event.target.value))}
          type="range"
          value={soreness}
        />
      </label>

      <label className="feedback-field">
        <div className="feedback-field__top">
          <span>完成度</span>
          <strong>{adherence}/5</strong>
        </div>
        <input
          className="feedback-slider"
          max="5"
          min="1"
          onChange={(event) => setAdherence(Number(event.target.value))}
          type="range"
          value={adherence}
        />
      </label>

      <label className="feedback-field">
        <div className="feedback-field__top">
          <span>疼痛或不适</span>
        </div>
        <input
          className="feedback-input"
          onChange={(event) => setPainText(event.target.value)}
          placeholder="例如：下背发紧"
          type="text"
          value={painText}
        />
      </label>

      <label className="feedback-field">
        <div className="feedback-field__top">
          <span>备注</span>
        </div>
        <textarea
          className="feedback-textarea"
          onChange={(event) => setNote(event.target.value)}
          placeholder="还有什么想告诉教练的？"
          rows={4}
          value={note}
        />
      </label>

      {error ? <p className="feedback-error">{error}</p> : null}

      <button className="action-button" disabled={isPending} type="submit">
        {isPending ? "提交中..." : "提交反馈"}
      </button>
    </form>
  );
}
