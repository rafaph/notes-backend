import { Interface } from "@app/domains/common/types/interface";

export type FromEntityType<Entity> = Omit<
    Interface<Entity>,
    "hasId" | "recover" | "reload" | "remove" | "save" | "softRemove"
>;
