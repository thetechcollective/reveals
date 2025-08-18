# Markdown Demo
<!--section-->
<!-- .slide: data-background="#000000" -->

#### Element attributes

- Item 1 <!-- .element: class="fragment" data-fragment-index="2" -->
- Item 2 <!-- .element: class="fragment" data-fragment-index="1" -->

Note: This will only appear in the speaker notes window.

<!--slide-->
## PHP

```php [1|3-5]
public function foo()
{
    $foo = array(
        'bar' => 'bar'
    )
}
```

<!--slide-->

## C

```c [287: 2|4,6]
/* All of the options in this arg are valid, so handle them. */
p = arg + 1;
do {
    if (*p == 'n')
        nflag = 0;
    if (*p == 'e')
        eflag = '\\';
} while (*++p); 
```

[source](https://git.busybox.net/busybox/tree/coreutils/echo.c?h=1_36_stable#n287)

<!--section-->
# Math

#### The Lorenz Equations

<div>
\[ J(\theta_0,\theta_1) = \sum_{i=0} \]
</div>

<!--slide-->
#### Complex Math

<div>
\[\begin{aligned}
\dot{x} &amp; = \sigma(y-x) \\
\dot{y} &amp; = \rho x - y - xz \\
\dot{z} &amp; = -\beta z + xy
\end{aligned} \]
</div>

<!--slide-->
Content 2.1

<div class="fragment">
 \[\begin{aligned}
 \dot{x} &amp; = \sigma(y-x) \\
 \dot{y} &amp; = \rho x - y - xz \\
 \dot{z} &amp; = -\beta z + xy
 \end{aligned} \]
</div>

<!--section-->
## Image

![Sample image](https://static.slid.es/logo/v2/slides-symbol-512x512.png) <!-- .element: style="width:30px" -->
