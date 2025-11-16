import type { DataProvider } from "@refinedev/core";
import { products as productsSeed, stores as storesSeed } from "../data/dummy";
import type { Product, Store } from "../types";

let products: Product[] = [...productsSeed];
let stores: Store[] = [...storesSeed];

type CollectionName = "products" | "stores";

const getCollection = (resource: string): Product[] | Store[] => {
  if (resource === "products") return products;
  if (resource === "stores") return stores;
  throw new Error(`Unknown resource: ${resource}`);
};

export const memoryDataProvider: DataProvider = {
  getApiUrl: () => "/api",

  getList: async ({ resource, pagination, sorters }) => {
    const collection = [...(getCollection(resource) as any[])];
    if (sorters && sorters.length > 0) {
      const { field, order } = sorters[0];
      collection.sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av === bv) return 0;
        const res = av > bv ? 1 : -1;
        return order === "asc" ? res : -res;
      });
    }
    const page = pagination?.current ?? 1;
    const pageSize = pagination?.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return { data: collection.slice(start, end), total: collection.length } as any;
  },

  getOne: async ({ resource, id }) => {
    const collection = getCollection(resource) as any[];
    const record = collection.find((item) => String(item.id) === String(id));
    if (!record) throw new Error(`${resource} with id ${id} not found`);
    return { data: record } as any;
  },

  create: async ({ resource, variables }) => {
    const collection = getCollection(resource) as any[];
    const id = (Math.max(0, ...collection.map((x) => Number(x.id) || 0)) + 1).toString();
    const newItem = { id, ...variables } as any;
    collection.push(newItem);
    if (resource === "products") products = collection as Product[];
    if (resource === "stores") stores = collection as Store[];
    return { data: newItem } as any;
  },

  update: async ({ resource, id, variables }) => {
    const collection = getCollection(resource) as any[];
    const idx = collection.findIndex((item) => String(item.id) === String(id));
    if (idx === -1) throw new Error(`${resource} with id ${id} not found`);
    collection[idx] = { ...collection[idx], ...variables };
    if (resource === "products") products = collection as Product[];
    if (resource === "stores") stores = collection as Store[];
    return { data: collection[idx] } as any;
  },

  deleteOne: async ({ resource, id }) => {
    const collection = getCollection(resource) as any[];
    const idx = collection.findIndex((item) => String(item.id) === String(id));
    if (idx === -1) throw new Error(`${resource} with id ${id} not found`);
    const [deleted] = collection.splice(idx, 1);
    if (resource === "products") products = collection as Product[];
    if (resource === "stores") stores = collection as Store[];
    return { data: deleted } as any;
  },

  getMany: async ({ resource, ids }) => {
    const collection = getCollection(resource) as any[];
    const records = collection.filter((item) => ids.map(String).includes(String(item.id)));
    return { data: records } as any;
  },

  createMany: async () => ({ data: [] } as any),
  updateMany: async () => ({ data: [] } as any),
  deleteMany: async () => ({ data: [] } as any),
};

export default memoryDataProvider;
