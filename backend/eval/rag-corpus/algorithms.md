# Algorithms

## Binary search

Binary search finds a target in a sorted array by repeatedly halving the
search range. Each step compares the target to the middle element and discards
half of the remaining elements. It runs in O(log n) time, far faster than
scanning every element one by one, which takes O(n) time.

## Bubble sort

Bubble sort repeatedly steps through a list, compares adjacent elements, and
swaps them when they are in the wrong order. It is simple but slow, and is
rarely used on large inputs.

## Hash tables

A hash table stores key-value pairs and offers average O(1) lookup by mapping
each key to a bucket with a hash function. Collisions are handled with chaining
or open addressing.
