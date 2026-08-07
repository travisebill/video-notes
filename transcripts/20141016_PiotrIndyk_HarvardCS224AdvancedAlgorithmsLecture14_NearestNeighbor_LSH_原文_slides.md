<!-- Slide number: 1 -->
Near(est) Neighbor Search in High Dimensions
Piotr Indyk
MIT

<!-- Slide number: 2 -->

Nearest Neighbor Search
Given: a set P of n points in Rd
Nearest Neighbor: for any query q, returns a point pP minimizing ||p-q||
r-Near Neighbor: for any query q, returns a point pP  s.t.
   ||p-q||  r (if it exists)

q

r

### Notes:

<!-- Slide number: 3 -->
High-dimensional near(est) neighbor: applications
Machine learning: nearest neighbor rule
Find the closest example with known class
Copy the class label
Near-duplicate Retrieval

?

![Picture 10](Picture10.jpg)

![Picture 4](Picture4.jpg)

![Picture 5](Picture5.jpg)

![Picture 6](Picture6.jpg)

![Picture 7](Picture7.jpg)

![Picture 8](Picture8.jpg)

![Picture 11](Picture11.jpg)

![Picture 12](Picture12.jpg)

![Picture 13](Picture13.jpg)

![Picture 14](Picture14.jpg)

![Picture 15](Picture15.jpg)

![Picture 17](Picture17.jpg)

Dimension=number of pixels

To be or not to be …

(... , 2, …, 2, … , 1 , …, 1, …)
(... , 1, …, 4, … , 2 , …, 2, …)
(... , 6, …, 1, … , 3 , …, 6, …)
(... , 1, …, 3, … , 7 , …, 5, …)
Dimension=number of words

### Notes:
Flip examples; mention videos

<!-- Slide number: 4 -->
The case of d=2

![Picture 3](Picture3.jpg)
Compute Voronoi diagram
Given q, perform point location
Performance:
Space: O(n)
Query time: O(log n)

### Notes:

<!-- Slide number: 5 -->
The case of d>2
Voronoi diagram has size n[d/2]
[Dobkin-Lipton’78]: n2^(d+1) space, f(d) log n
[Clarkson’88]: n[d/2](1+ε) space, f(d) log n time
[Meiser’93]: nO(d) space, (d+ log n)O(1) time
We can also perform a linear scan: O(dn) time

### Notes:

<!-- Slide number: 6 -->

Approximate Nearest Neighbor
c-Approximate Nearest Neighbor: build data structure which, for any query q
returns  p’P,  ||p-q|| ≤ cr,
where r is the distance to the nearest neighbor of  q

q

r
cr

### Notes:

<!-- Slide number: 7 -->

Approximate Near Neighbor
c-Approximate r-Near Neighbor: build data structure which, for any query q:
If there is a point pP, ||p-q|| ≤ r
it returns  p’P,  ||p-q|| ≤ cr

Most algorithms randomized:
For each query q, the probability (over the randomness used to construct the data structure) is at least 90%

q

r
cr

### Notes:

<!-- Slide number: 8 -->
  Approximate algorithms
Space/time exponential in d [Arya-Mount’93],[Clarkson’94], [Arya-Mount-Netanyahu-Silverman-Wu’98] [Kleinberg’97], [Har-Peled’02], ….
Space/time polynomial in d [Indyk-Motwani’98], [Kushilevitz-Ostrovsky-Rabani’98], [Indyk’98], [Gionis-Indyk-Motwani’99], [Charikar’02], [Datar-Immorlica-Indyk-Mirrokni’04], [Chakrabarti-Regev’04], [Panigrahy’06], [Ailon-Chazelle’06], [Andoni-Indyk’06],…., [Andoni-Indyk-Nguyen-Razenshteyn’14], [Andoni-Razenshteyn’15]

| Space | Time | Comment | Norm | Ref |
| --- | --- | --- | --- | --- |
| dn+nO(1/ε2) | d \* logn /ε2 (or 1) | c=1+ ε | Hamm, l2 | [KOR’98, IM’98] |
| nΩ(1/ε2) | O(1) |  |  | [AIP’06] |
| dn+n1+ρ(c) | dnρ(c) | ρ(c)=1/c | Hamm, l2 | [IM’98], [GIM’98],[Cha’02] |
|  |  | ρ(c)<1/c | l2 | [DIIM’04] |
|  |  | ρ(c)=1/c2 + o(1) | l2 | [AI’06] |
|  |  | ρ(c)= (7/8)/c2 + o(1/c3) | l2 | [AINR’14] |
|  |  | ρ(c)= 1/(2c2-1)+o(1) | l2 | [AR’15] |
| dn \* logs | dnσ(c) | σ(c)=O(1/c) | l2 | [Panigrahy’06] |
|  |  | σ(c)=O(1/c2) | l2 | [AI’06] |

### Notes:

<!-- Slide number: 9 -->
LSH
A family H of functions h: Rd → U is called (P1,P2,r,cr)-sensitive for distance D, if for any p,q:
If D(p,q) <r   then Pr[ h(p)=h(q) ] > P1
If D(p,q) >cr then Pr[ h(p)=h(q) ] < P2

Example: Hamming distance
h(p)=pi, i.e., the i-th bit of p
Probabilities: Pr[ h(p)=h(q) ] = 1-D(p,q)/d

p=10010010
q=11010110

### Notes:

<!-- Slide number: 10 -->
Algorithm
We use functions of the form
g(p)=<h1(p),h2(p),…,hk(p)>
Preprocessing:
Select g1…gL independently at random
For all pP, hash p to buckets g1(p)…gL(p)

Query:
Retrieve the points from buckets g1(q), g2(q), … , until
Either the points from all L buckets have been retrieved, or
Total number of points retrieved exceeds 3L
Answer the query based on the retrieved points
Total time: O(dL)

<!-- Slide number: 11 -->
Analysis
Lemma1: the algorithm solves c-approximate NN with:
Number of hash functions:
 L=C n, =log(1/P1)/log(1/P2)
   (C=C(P1,P2) is a constant for  P1 bounded away from 0)
Constant success probability for a fixed query q
Lemma 2: for Hamming LSH functions, we have =1/c

<!-- Slide number: 12 -->
Proof
Define:
p: a point such that ||p-q|| ≤ r
FAR(q)={ p’P: ||p’-q|| >c r }
Bi(q)={ p’P: gi(p’)=gi(q) }
Will show that both events occur with >0 probability:
E1: gi(p)=gi(q) for some i=1…L
E2: Σi |Bi(q)  FAR(q)| < 3L

### Notes:

<!-- Slide number: 13 -->
Proof ctd.
Set k= ceil(log1/P2 n)
For p’FAR(q) ,
Pr[gi(p’)=gi(q)] ≤ P2k ≤1/n
E[ |Bi(q)FAR(q)| ] ≤ 1
E[Σi |Bi(q)FAR(q)| ] ≤ L
Pr[Σi |Bi(q)FAR(q)|≥3L ] ≤ 1/3

### Notes:

<!-- Slide number: 14 -->
Proof, ctd.
Pr[ gi(p)=gi(q) ] 	≥ 1/P1k ≥ P1 log1/P2 (n)+1
					≥ 1/(P1 n)=1/L
Pr[ gi(p)≠gi(q), i=1..L] ≤ (1-1/L)L ≤ 1/e

### Notes:

<!-- Slide number: 15 -->
Proof, end
Pr[E1 not true]+Pr[E2 not true]
   ≤ 1/3+1/e =0.7012.
Pr[ E1  E2 ] ≥ 1-(1/3+1/e) ≈0.3

### Notes:

<!-- Slide number: 16 -->
Proof of Lemma 2
Statement: for
P1=1-r/d
P2=1-cr/d
   we have =log(P1)/log(P2) ≤ 1/c
Proof:
Need P1c ≥ P2
But (1-x)c ≥ (1-cx) for any 1>x>0, c>1

<!-- Slide number: 17 -->
Recap
LSH solves c-approximate NN with:
Number of hash fun: L=O(n), =log(1/P1)/log(1/P2)
 For Hamming distance we have =1/c
Questions:
Beyond Hamming distance ?
Reduce the exponent  ?

<!-- Slide number: 18 -->
Random Projection LSH for L2
[Datar-Immorlica-Indyk-Mirrokni’04]

Define hX,b(p)=(p*X+b)/w:
w ≈ r
X=(X1…Xd) , where Xi are i.i.d. random variables chosen from Gaussian distribution
b is a scalar chosen uniformly at random from [0,w]

X

w
w

p

### Notes:

<!-- Slide number: 19 -->
Analysis
Need to:
Compute Pr[h(p)=h(q)] as a function of ||p-q|| and w; this defines P1 and P2
For each c choose w that minimizes
=log1/P2(1/P1)

w
w

### Notes:

<!-- Slide number: 20 -->
(c) for l2

![Picture 3](Picture3.jpg)
Improvement not dramatic
But the hash function very simple and works directly in l2

### Notes:

<!-- Slide number: 21 -->

Ball lattice hashing
[Andoni-Indyk’06]
Instead of projecting onto R1,
    project onto Rt , for constant t
Intervals → lattice of balls
Can hit empty space, so hash until a ball is hit
Analysis:
 =1/c2 + O( log t / t1/2 )
Time to hash is tO(t)
Total query time: dn1/c2+o(1)
[Motwani-Naor-Panigrahy’06]: LSH in l2 must have  ≥ 0.45/c2
[O’Donnell-Wu-Zhou’09]:
     ≥ 1/c2 – o(1)

X

w
w
p

p

### Notes:

<!-- Slide number: 22 -->
Data-dependent hashing
The aforementioned LSH schemes are optimal for data oblivious hashing
Select g1…gL independently at random
For all pP, hash p to buckets g1(p)…gL(p)
Retrieve the points from buckets g1(q), g2(q), …
The new schemes are data dependent
If the points are “random”, can prove better bound
If the points are not “random”, cluster and recurse

<!-- Slide number: 23 -->
LSH Zoo
Have seen:
Hamming metric: projecting on coordinates
L2 :random projection+quantization
Other (provable):
L1 norm: random shifted grid [Andoni-Indyk’05] (cf. [Bern’93])
Vector angle [Charikar’02] based on [Goemans-Williamson’94]
Jaccard coefficient [Broder’97]
J(A,B) = |A ∩ B| / |A u B|
Other (empirical): inscribed polytopes [Terasawa-Tanaka’07], orthogonal partition [Neylon’10]
Other (applied): semantic hashing, spectral hashing, kernelized LSH, Laplacian co-hashing, , BoostSSC, WTA hashing,…

<!-- Slide number: 24 -->
Min-wise hashing
[Broder’97, Broder-Charikar-Frieze-Mitzenmacher’98]
In many applications, the vectors tend to be quite sparse (high dimension, very few 1’s)
Easier to think about them as sets
For two sets A,B, define the Jaccard coefficient:
J(A,B)=|A ∩ B|/|A U B|
If A=B then J(A,B)=1
If A,B disjoint then J(A,B)=0
Can we design LSH families for J(A,B) ?

<!-- Slide number: 25 -->
Hashing
Mapping:
g(A)=minaA h(a)
   where h is a random permutation of the elements in the universe
Fact:  Pr[g(A)=g(B)]=J(A,B)
Proof:  Where is min( h(A) U h(B) ) ?

A
B

<!-- Slide number: 26 -->
Random hyperplane
[Goemans-Williamson’94, Charikar’02]
Let u,v be unit vectors in Rm
Angular distance:
A(u,v)=angle between u and v
Hashing:
Choose a random unit vector r
Define s(u)=sign(u*r)

<!-- Slide number: 27 -->
Probabilities
What is the probability of
sign(u*r)≠sign(v*r) ?
It is   A(u,v)/π

u
v
A(x,y)

<!-- Slide number: 28 -->
New LSH scheme, ctd.
How does it work in practice ?
The time tO(t)dn1/c2+f(t) is not very practical
Need t30 to see some improvement
Idea: a different decomposition of Rt
Replace random balls by Voronoi diagram of a lattice
For specific lattices, finding a cell containing a point can be very fast →fast hashing

<!-- Slide number: 29 -->
Leech Lattice LSH
Use Leech lattice in R24 , t=24
Largest kissing number in 24D: 196560
Conjectured largest packing density in 24D
24 is 42 in reverse…
Very fast (bounded) decoder: about 519 operations [Amrani-Beery’94]
Performance of that decoder for c=2:
1/c2 					      0.25
1/c					      0.50
Leech LSH, any dimension: 		  0.36
Leech LSH, 24D (no projection):	  0.26
