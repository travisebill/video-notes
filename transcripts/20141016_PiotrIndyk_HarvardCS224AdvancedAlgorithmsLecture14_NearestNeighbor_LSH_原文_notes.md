CS 224: Advanced Algorithms

Fall 2014

Lecture 14 — October 16, 2014

Prof. Jelani Nelson

Scribe: Jao-ke Chin-Lee

1 Overview

In the last lecture we covered learning topic models with guest lecturer Rong Ge.

In this lecture we cover nearest neighbor search with guest lecturer Piotr Indyk.

2

Introduction

We ﬁrst deﬁne the nearest neighbor search problem.

Deﬁnition 1 (Nearest Neighbor Search). Given a set P of n points in Rn, for any query q, return
the p ∈ P minimizing (cid:107)p − q(cid:107), i.e. we wish to ﬁnd the point closest to q by some metric.

Deﬁnition 2 (r-Near Neighbor Search). Given parameter r and a set P of n points in Rn, for
any query q, if any such exist, return a p ∈ P s.t. (cid:107)p − q(cid:107) ≤ r, i.e. we wish to ﬁnd points within
distance of q by some metric.

Note we can consider r-near neighbor search to be a decision problem formulation of nearest neigh-
bor search.

Nearest neighbor search, especially high-dimensional instances, often appear in machine learning
(consider the problems of determining image similarity or analyzing handwriting, in which given
classiﬁed image data, we wish to determine the “class” of some query image as determined by
closeness; the dimension here is the number of pixels); another example is near duplicate retrieval,
as discussed in the last lecture, in which the dimension is the number of words.

Example (d = 2). We brieﬂy consider the simple case of d = 2, i.e. the problem of determining
the nearest point in a plane. The standard solution is to use Voronoi diagrams, which split the
space into regions according to proximity, in which case the problem reduces to determining point
location within the Voronoi diagram. We can do this by building a BST quickly to determining
the cell containing any given point: this takes O(n) space and O(log n) query.

When we consider higher dimensions, i.e. d > 2, however, the Voronoi diagram has size n(cid:100)d/2(cid:101),
which is prohibitively large. Also note we can simply perform a linear scan in O(dn) time.

Therefore, we instead consider approximations.

3 Approximate Nearest Neighbor

We deﬁne the approximation version of nearest neighbor search.

1

Deﬁnition 3 (c-Approximate Nearest Neighbor Search). Given approximation factor c and a set
P of n points in Rn, for any query q, return a p(cid:48) ∈ P s.t. (cid:107)p(cid:48) − q(cid:107) ≤ cr where r = (cid:107)p − q(cid:107) and p is
the true nearest neighbor, i.e. we wish to ﬁnd a point at most some factor c away from the point
closest to q.

Deﬁnition 4 (c-Approximate r-Near Neighbor Search). Given approximation factor c and param-
eter r and a set P of n points in Rn, for any query q, if any p ∈ P exists s.t. (cid:107)p − q(cid:107) ≤ r, return
a p(cid:48) ∈ P s.t. (cid:107)p(cid:48) − q(cid:107) ≤ rc, i.e. we wish to a point at most some factor c away from some point
within a range of q.

Also note that if we enumerate all approximate near neighbors, we can ﬁnd the exact near neighbor.

We build up a data structure to solve these problems; if, however, in the c-approximate r-near
neighbor search, there is no such point, our data structure can return anything, so instead we can
compute the distance to double check, and if the distance places us outside our ball, we know there
was no such point.

Now we consider algorithms to solve these search problems.

4 Algorithms

Most algorithms are randomized, i.e. for any query we succeed with high probability over on the
initial randomness used to build our data structure (which is the only randomness introduced into
the system).
In fact, because our data structure satisﬁed the desired behavior with probability
bounded by a constant, by working iteratively, we can bring our probability of failure arbitrarily
close to 0.

Some algorithms and their bounds appear below.

We will focus on locality-sensitive hashing as presented by Indyk and Motwani [IM98], Gionis,
Indyk and Motwani [GIM99], and Charikar [Cha02], and touch on a few others that have appeared
in recent work.

5 Locality-Sensitive Hashing

Recall when we covered hashing that collisions happened more or less on an independent basis.
Here, we will use hashing whose probability of collision depends on the similarity between the
queries.

Deﬁnition 5 (Sensitivity). We call a family H of functions h : Rd → U (where U is our hashing
universe) (P1, P2, r, cr)-sensitive for a distance function D if for any p, q:

• D(p, q) < r ⇒ P[h(p) = h(q)] > P1, i.e. if p and q are close, the probability of collision is

high; and

• D(p, q) > cr ⇒ P[h(p) = h(q)] < P2, i.e. if p and q are far, the probability of collision is low.

2

Example (Hamming distance). Suppose we have h(p) = pi, i.e. we hash to the ith bit of length d
bitstring p, and let D(p, q) be the Hamming distance between p and q, i.e. the number of diﬀerent
bits (place-wise) between p and q. Then our probability of collision is always 1 − D(p, q)/d (since
D(p, q)/d is the probability of choosing a diﬀerent bit).

5.1 Algorithm

We use functions of the form g(p) = (cid:104)h1(p), h2(p), . . . , hk(p)(cid:105).

In preprocessing, we build up our data structure: after selecting g1, . . . , gL independently and at
random (where k and L are functions of c and r that we will compute later), hash every p ∈ P to
buckets g1(p), . . . , gL(p).

When querying, we proceed as follows:

• retrieve points from buckets g1(q), . . . , gL(q) until either we have retrieved the points from all

L buckets, or we have retrieved more than 3L points in total

• answer query based on retrieved points (whether procedure terminated from ﬁrst or second

case above)

Note that hashing takes time d, and with L buckets, the total time here is O(dL).

Next we will prove space and query performance bounds as well as the correctness of the parameters.

5.2 Analysis

We will prove two lemmata for query bounds, the second speciﬁcally for Hamming LSH.

Lemma 6. The above algorithm solves c-approximate nearest neighbor with

• L = Cnρ hash functions, where ρ = log P1/ log P2, where C is a function of P1 and P2, for

P1 bounded away from 0, and hence constant; and

• a constant success probability for ﬁxed query q

Proof. Deﬁne

• p point s.t. (cid:107)p − q(cid:107) ≤ r;

• FAR(q) = {p(cid:48) ∈ P : (cid:107)p(cid:48) − q(cid:107) > cr} the set of points “far” from q;

• Bi(q) = {p(cid:48) ∈ P : gi(p(cid:48)) = gi(q)} the set of points in the same bucket as q

and

• E1 : gi(p) = gi(q) for some i = 1, . . . , L: the event of colliding in a bucket with the desired

query;

3

• E2 : (cid:80)

exceeding 3L.

i |Bi(q) ∩ FAR(q)| < 3L: the event of total number of far points in buckets not

We will show that both E1 and E2 occur with nonzero probability.
Set k = (cid:100)log1/P2 n(cid:101). Observe that for p(cid:48) ∈ FAR(q), P[gi(p(cid:48)) = gi(q)] ≤ P k

2 ≤ 1/n. Therefore

E[|Bi(1) ∩ FAR(q)|] ≤ 1

(cid:88)

⇒E[

i
(cid:88)

⇒P[

i

|Bi(1) ∩ FAR(q)|] ≤ L

|Bi(1) ∩ FAR(q)| ≥ 3L] ≤

1
3

by Markov

and

P[gi(p) = gi(q)] ≥

⇒P[gi(p) = gi(q)] ≥

1+log1/P2
1

n

≥ P

1
P k
1
1
P1nρ =:

1
L

(we choose L accordingly)

⇒P[gi(p) (cid:54)= gi(q), i = 1, . . . , L] ≤

(cid:18)

1 −

⇒P[E1 not true ] + P[E2 not true ] ≤

⇒P[E1 ∩ E2] ≥ 1 −

(cid:18) 1
3

+

(cid:19)

1
e

≈ .3

1
L
1
3

(cid:19)L

+

1
e

≤

1
e

≈ .7

Thus also note we can make this probability arbitrarily small.

Lemma 7. For Hamming LSH functions, we have ρ = 1/c.

Proof. Observe that with a Hamming distance, P1 = 1 − r/d and P2 = 1 − cr/d, so it suﬃces to
show ρ = log P1/ log P2 ≤ 1/c, or equivalently P c
1 ≥ P2. But (1 − x)c ≥ 1 − cx for any 1 > x > 0,
c > 1, so we are done.

Also note that space is nL, so we have desired space bounds as well.

6 Beyond

Now we brieﬂy consider other metrics beyond the Hamming distance, and ways to reduce the
exponent ρ. (Final project ideas?)

6.1 Random Projection LSH for L2

This covers work by [DIIM04].

4

We deﬁne hX,b(p) = (cid:100)(p · X + b)/w(cid:101), where w ≈ r, X = (X1, . . . , Xd are iid Gaussian random
variables, and b is a scalar chosen uniformly at random from [0, w]. Conceptually, then, our fash
function takes p, projects it on to X, shifts it by some amount b, then determines the interval of
length w containing it.

This only has a small improvement over the 1/c bound, however (please refer to slides for more
details).

Therefore we consider alternative ways of projection.

6.2 Ball Lattice Hashing

This covers work by [AI06].

Instead of projecting onto R1, we project onto Rt for constant t. We quantize with a lattice of
balls—when we hit empty space, we rehash until we do hit a ball (observe that using a grid would
degenerate back to the 1-d case).

With this, we have ρ = 1/c2 + O(log t/
of hitting a ball gets smaller and smaller with higher dimensions.

t)), but hashing time increases to tO(t) because our changes

√

For more details and analysis, as well as other LSH schemes (including data dependent hashing,
in which we cluster related data until it is “random,” which presents better bounds) and schemes
(including the Jaccard coeﬃcient we explored in pset 2), please refer to the slides.

References

[AI06] Alexandr Andoni and Piotr Indyk. Near-optimal hashing algorithms for approximate nearest

neighbor in high dimensions. FOCS ’06, 459-468, 2006.

[Cha02] Moses S. Charikar. Similarity Estimation Techniques from Rounding Algorithms. STOC

’02, 380–388, 2002.

[DIIM04] Mayur Datar, Nicole Immorlica, Piotr Indyk and Vahab S. Mirrokni. Locality-sensitive

Hashing Scheme Based on P-stable Distributions. SCG ’04, 253–262, 2004.

[GIM99] Aristides Gionis, Piotr Indyk and Rajeev Motwani. Similarity search in high dimensions

via hashing. VLDB, 518–529, 1999.

[IM98] Piotr Indyk and Rajeeve Motwani. Approximate Nearest Neighbors: Towards Removing

the Curse of Dimensionality. STOC ’98, 604–613, 1998.

5


