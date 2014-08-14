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
        distinct : 'fields.label',
        exclude : ['fields.newColumn'],
        include : ['fields.testfield']
      }
    }
    
The returned object is an array with limit, skip and total.  The total is the value of all content matched by query, not just returned objects.