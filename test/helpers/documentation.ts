import { OpenAPIDocument } from "easy-api-doc";

import { version } from "../../package.json";

export const doc = new OpenAPIDocument(
    "./doc/api-reference.yml",
    {
        version,
        title: "Notes API",
        description: "Notes REST API definitions",
    },
    [{ url: "", description: "Notes Server" }],
);
