---
title: Queries
uuid: queries

---

#####Queries

Grasshopper's query builder accepts a query object that contains several parameters, some optional.

The returned object is an array with limit, skip and total.  The total is the value of all content matched by query, not just returned objects.

Definitions for all possible query parameters/options

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
    * * limit : Limit number of results. String or number.
    * * skip : Skip specified number of results.  String or number. (limit and skip support pagination)
    * * distinct : return distinct results within a find.  Can include types.
    * * exclude : array of fields to be excluded from query.
    * * include : array of fields to be included in query.


Important Notes:

* The options object can have include or exclude parameters, but not both in the same query.
* When using 'options.distinct', filters can't be used.  This means paging is not available.