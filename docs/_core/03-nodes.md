---
title: Nodes
uuid: core-nodes
---
#### Nodes

All content in Grasshopper is typed, meaning that it has a definition. Think of content types like a database table schema, more or less, that is what they are. All content types contain a a few metadata elements and a collection of fields. Fields are specific containers that you want to store data (think of a database column). Values for fields can be a single value (number, string), a collection of values (one-to-many), embeded content type, or a collection of embeded content types. IMPORTANT: Content Types define the types of data that you can store in your application, they are NOT the actual data.

Leverage the power of NoSQL, fully supports “one-to-many” and nested objects

Fields can have default values and can also be required

Fields can contain validation

Fields can nest other content types

Fields can support a collection of values

Fields can reference other content objects