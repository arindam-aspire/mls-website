import json
import os

path = os.path.join(os.environ["TEMP"], "openapi.json")
with open(path, encoding="utf-8") as f:
    d = json.load(f)

targets = [
    "/api/v1/owners/{owner_id}",
    "/api/v1/owners/{owner_id}/activate",
    "/api/v1/owners/{owner_id}/deactivate",
]

for p in targets:
    print("===", p)
    for method, spec in d["paths"][p].items():
        if method not in ("get", "post", "patch", "put", "delete"):
            continue
        print(method.upper(), "-", spec.get("summary"))
        rb = spec.get("requestBody")
        if not rb:
            print("  body: none")
            continue
        schema = rb.get("content", {}).get("application/json", {}).get("schema", {})
        ref = schema.get("$ref")
        if ref:
            name = ref.rsplit("/", 1)[-1]
            print("  body ref:", name)
            print("  schema:", json.dumps(d["components"]["schemas"].get(name, {}), indent=2)[:1000])
        else:
            print("  body schema:", json.dumps(schema, indent=2)[:1000])
