import { get, writable } from 'svelte/store';

const base: string = import.meta.env.BASE_URL;
const basepath = base.endsWith('/') ? base.substring(0, base.length - 1) : base;
const data = writable<Map<string, object>>(new Map<string, object>());

const read = (path: string): object => {
    return get(data).get(path);
};
const write = (path: string, newEntry: object) => {
    data.update((state) => state.set(path, newEntry));
};

export async function getData(path: string, callback: (data: object) => void): Promise<void> {
    const absolutePath = `${basepath}/data/${path}`;
    const val = read(absolutePath);
    if (val === undefined) {
        await fetch(absolutePath, {
            cache: 'no-store',
            headers: {
                Accept: 'application/json'
            }
        })
            .then((r) => {
                if (r.ok) return r.json();
                else return undefined;
            })
            .then((jsonData) => {
                if (jsonData) {
                    write(absolutePath, jsonData);
                    callback(jsonData);
                } else callback(null);
            })
            .catch((_) => {
                // TODO
            });
        return;
    }
    callback(val);
}
