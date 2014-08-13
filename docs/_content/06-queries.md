---
title: Queries
uuid: queries

---

#####Queries

Grasshopper's query builder accepts a query object that contains several parameters, some optional.

Example query object : 

    { filters : [{ key : 'fields.label', cmp: '<', value: 'search test' }],
      types : [],
      nodes : [],
      options : {
        limit : 1,
        skip  : 2,
        distinct : 'fields.label'
      }
    }