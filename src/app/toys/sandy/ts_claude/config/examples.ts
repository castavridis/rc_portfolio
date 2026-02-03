// ============================================================================
// CONFIG: examples.js
// ============================================================================

export const examples = {
  factorial: `val
  of fac(7)
!
  fac(n): if
    match n
  !
    m+1 -> n*fac(m)
  !
    0 -> 1
  fi
lav`,

  gcd: `val
  of gcd(6*5*11, 6*13*5)
!
  gcd(j,k): if
    match (j-k, k-j)
  !
    (_,m+1) -> gcd(j, k-j)
  !
    (0,0) -> j
  !
    (m+1,_) -> gcd(j-k, k)
  fi
lav`,

  fibonacci: `val
  of fib(10)
!
  fib(n): if
    match n
  !
    0 -> 0
  !
    1 -> 1
  !
    m+2 -> fib(m) + fib(m+1)
  fi
lav`,

  echo: `val
  of x + y
!
  x: 10
!
  y: 20
!
  echo x * y
lav`,

  isEven: `val
  of isEven(7)
!
  isEven(n): if
    match n
  !
    0 -> 1
  !
    1 -> 0
  !
    m+2 -> isEven(m)
  fi
lav`,

  power: `val
  of pow(2, 10)
!
  pow(b, e): if
    match e
  !
    0 -> 1
  !
    n+1 -> b * pow(b, n)
  fi
lav`,
};
