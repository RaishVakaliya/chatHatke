"use client";

import { useCallback, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const TYPING_TIMEOUT = 2000;

export function useTyping(chatId: Id<"chats">) {
  const setTyping = useMutation(api.typing.setTyping);
  const clearTyping = useMutation(api.typing.clearTyping);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTyping = useCallback(() => {
    // Send a pulse to the server
    setTyping({ chatId }).catch(() => {});

    // Reset the auto-clear timer
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      clearTyping({ chatId }).catch(() => {});
    }, TYPING_TIMEOUT);
  }, [chatId, setTyping, clearTyping]);

  const stopTyping = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    clearTyping({ chatId }).catch(() => {});
  }, [chatId, clearTyping]);

  return { startTyping, stopTyping };
}
