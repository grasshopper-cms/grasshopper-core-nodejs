---
title: Queries
uuid: queries-example
language: javascript

---

Query object examples:

{ filters : [{ key : 'fields.label', cmp: '<', value: 'search test' }],
  types : [],
  nodes : [],
  options : { limit : 1,
              skip  : 2,
              distinct : 'fields.label',
              exclude : ['fields.newColumn']
            }
}

/*
- This object would return results  where 'fields.label' is less than the value 'search test.'
  It would limit the result to 1 document and skip the first 2 results.  It would only return documents
  where 'fields.label' is a distinct value.  It would also exclude
*/

{
    filters : [key : 'fields.slug' , cmp : 'equals', value: 'testValue'],
    types : ['2389vj2jf8r', 'ssjkl932'],
    options : {include : ['fields.label', 'fields.name', 'fields.description']}
}

/*
- This object would return results from content types '2389vj2jf8r' and 'ssjkl932' where 'fields.label',
  'fields.name' or 'fields.description' match the value 'testValue'.
*/


{
    filters : [
        key : 'fields.slug',
        cmp : 'between',
        value: [
            'exampleValue1', 'exampleValue2'
            ]
        ],
    nodes : ['83h7hjks8fhh'],
    options : {}
}

/*
- This object would return content with 'fields.slug' value between 'exampleValue1' and 'exampleValue2'
  from node '83h7hjks8fhh'.  Note that even though the options object is empty, query executes normally.
*/