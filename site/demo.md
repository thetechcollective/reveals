# DEMO
<!--section-->

[![reveal.js logo](https://static.slid.es/reveal/logo-v1/reveal-white-text.svg)](https://revealjs.com) <!-- .element class="demo-logo" style="height: 180px; margin: 0 auto 4rem auto; background: transparent;" -->

### The HTML Presentation Framework

Created by [Hakim El Hattab](http://hakim.se) and [contributors](https://github.com/hakimel/reveal.js/graphs/contributors)
<!-- .element: style="font-size:small;" -->

<!--section-->

## Hello There

reveal.js enables you to create beautiful interactive slide decks using `HTML`

But more importantly `MarkDown` is also fully supported.<br/>
This presentation will show you examples of what it can do.
<!-- .element: class="fragment" -->

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

<!--section-->
## Point of View

Press **ESC** to enter the slide overview.

Hold down the **alt** key (Win) or **ctrl** (Mac) and click on any element to zoom towards it using [zoom.js](http://lab.hakim.se/zoom-js). Click again to zoom back out.


<!--section-->

<section data-auto-animate data-auto-animate-easing="cubic-bezier(0.770, 0.000, 0.175, 1.000)">
  <h2>Auto-Animate</h2>
  <p>Automatically animate matching elements across slides with <a href="https://revealjs.com/auto-animate/">Auto-Animate</a>.</p>
  <div class="r-hstack justify-center">
    <div data-id="box1" style="background: #999; width: 50px; height: 50px; margin: 10px; border-radius: 5px;"></div>
    <div data-id="box2" style="background: #999; width: 50px; height: 50px; margin: 10px; border-radius: 5px;"></div>
    <div data-id="box3" style="background: #999; width: 50px; height: 50px; margin: 10px; border-radius: 5px;"></div>
  </div>
</section>
<section data-auto-animate data-auto-animate-easing="cubic-bezier(0.770, 0.000, 0.175, 1.000)">
  <div class="r-hstack justify-center">
    <div data-id="box1" data-auto-animate-delay="0" style="background: cyan; width: 150px; height: 100px; margin: 10px;"></div>
    <div data-id="box2" data-auto-animate-delay="0.1" style="background: magenta; width: 150px; height: 100px; margin: 10px;"></div>
    <div data-id="box3" data-auto-animate-delay="0.2" style="background: yellow; width: 150px; height: 100px; margin: 10px;"></div>
  </div>
  <h2 style="margin-top: 20px;">Auto-Animate</h2>
</section>
<section data-auto-animate data-auto-animate-easing="cubic-bezier(0.770, 0.000, 0.175, 1.000)">
  <div class="r-stack">
    <div data-id="box1" style="background: cyan; width: 300px; height: 300px;"></div>
    <div data-id="box2" style="background: magenta; width: 200px; height: 200px;"></div>
    <div data-id="box3" style="background: yellow; width: 100px; height: 100px;"></div>
  </div>
  <h2 style="margin-top: 20px;">Auto-Animate</h2>
</section>
