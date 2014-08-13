---
title: Queries
uuid: queries-example
language: asciidocs
---

* *filters*: An array of optional filter objects for the query.
    * *key*: The key of the content being filtered.
    * *cmp*: The comparison operator for the filter value.  Currently supported operators (Query accepts symbol or string value): 
        * *'='*: equals
        * *'!=' or 'not' or 'notequal' or 'notequals'*: not equal to
        * *'>=' or 'gte'*: greater than or equals
        * *'>' or 'gt'*: greater than
        * *'<=' or 'lte'*: less than or equals
        * *'<' or 'lt'*: less than
        * *'in' or 'contains'*: contains
        * *'!in' or 'notin' or 'notcontains'*: does not contain
        * *'%' or 'like'*: like (Allows for 'fuzzy matching')
        * *'!%' or 'notlike'*: not like (Allows for 'fuzzy matching')
        * *'between'*: between 
        * *'notbetween'*: not between
        * *'size'*: size
        * *'exists'*: exists
    * *value*: Then value the filter will be compared with.
* *types*: An optional array of content type ids.  
* *nodes*: An optional array of node ids.
* *options*: Object.  Possible key/value pairs are: 
    * * limit : limit number of results. 
    * * skip : skip specified number of results.  (limit and skip support pagination)
    * * distinct : limits results only with distinct value of specified field. 