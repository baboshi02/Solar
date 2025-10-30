import { Actor, createActor } from "xstate";
import { messagingMachine } from "./State";

type BotActor = Actor<typeof messagingMachine>;

const userActors: Map<number, BotActor> = new Map();

export function destroyActor(chatId: number): void {
  const actor = userActors.get(chatId);
  if (actor) {
    actor.stop();
    userActors.delete(chatId);
    console.log(`[Chat ${chatId}] Actor stopped and removed.`);
  }
}
export function getOrCreateActor(chatId: number): BotActor {
  let actor = userActors.get(chatId);
  if (!actor) {
    actor = createActor(messagingMachine) as BotActor;
    actor.start();
    userActors.set(chatId, actor);
    actor.subscribe((state) => {
      console.log(`[Chat ${chatId}] Transitioned to: ${state.value}`);
    });
  }
  return actor;
}
