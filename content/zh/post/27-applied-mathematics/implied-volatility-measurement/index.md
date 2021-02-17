---
title: 如何衡量隐含波动率
subtitle: 隐含波动率的高低的衡量指标

# Summary for listings and search engines
summary: 隐含波动率的高低的衡量指标

# Link this post with a project
projects: []

# Date published
date: 2020-07-28T15:44:16Z

# Date updated
lastmod: 2020-07-28T15:44:16Z

# Is this an unpublished draft?
draft: false

# Show this page in the Featured widget?
featured: false

# Featured image
# Place an image named `featured.jpg/png` in this page's folder and customize its options here.
image:
  caption: Implied Volatility
  focal_point: Smart
  placement: 1
  preview_only: false

authors:
- admin

tags:
- Options
- Implied Volatility
- IV
- IVP
- IVR

categories:
- Applied Mathematics
- Financial Mathematics
---

隐含波动率（或称引申波幅，IV ）是了解何时买卖期权的最重要指标之一。IV 由特定股票或期货的期权合约的当前价格反推得出，用百分比表示，表示基于当前的期权价格，底层标的年化波动预期的标准差。例如，对于 200 美元的股票，IV 的 25％ 表示未来一年的标准差范围为 50 美元，更多关于 IV 的概念可以参考之前的文章。

 {{< cite page="deepdive-implied-volatility" view="4" >}}

由于波动率对期权价格有很大影响，所以通常我们会在波动率较高的环境下作为期权卖方，而在波动率较低的环境时作为期权买方。因此如何衡量波动率的相对高低成为了一个问题，通常不同标的波动率的横向对比并没有太多实际意义，本文就同一标的的情况下，侧重讨论几种衡量 IV 高低的方法。

## Implied Volatility Percentile 

隐含波动率百分位（Implied Volatility Percentile）为交易者提供了一个额外的度量标准来衡量期权价格的相对高低，下文统一用 IVP 描述。52 周 IVP 从当前日期前推一整年，通过观察历史波动率的高低，与当前的 IV 进行对比，计算出过去的一整年中低于当前 IV 值的天数占总天数的百分比。简单来说 IVP 主要统计在历史区间上有多少交易日的 IV 值是低于当前水准的，其公式为： 

$$ IVP = \sum_{i=1}^n [ \frac{ IV_i }{ IV_{ current } } ] \div n $$

$$ n = Period $$

通常在各种 Screener 或者 Broker 平台上能找到这个指标。图中的粉色标注的即为 IVP 趋势线，以 AAPL 为例目前的 IVP 为 62.7%，当日的全天平均波动率为 37.04%。

![Implied Volatility Percentile](https://www.tradingview.com/x/7EPkTWA2/)

52 周 IVP 通过将 AAPL IV 低于其当前水平的交易日天数除以 252（一年中的交易日数 n = 252）得出的。例如当前的 IVP 为 62.7%，可以理解为 AAPL 的波动率在过去一年的 62.7％（或一年的三分之二）内低于当前的隐含波动率，这表明 AAPL 的波动率在一年内大约三分之二时间内一直低于 37.04％，剩余的三分之一时间内 IV 都高于当前的 37.04%。这个数据意味着相比于过去一年内的 AAPL IV，当前波动率处于较高的三分之一区域，因此当前 IVP 状态下的期权，相对于更低 IVP 周期的期权来说，会更昂贵。 


## Implied Volatility Rank

隐含波动率等级（Implied Volatility Rank）这个译文总觉得不怎么顺口，下文依旧还是统一用 IVR 描述。IVR 同样是很多交易员在做期权策略时会考虑的一个衡量指标。基于过去一年的 IV 水平，IVR 可以衡量出当前隐含波动率处于波动率区间的高低位置。同一标的 IVR 越高意味着当前期权的价格越昂贵，通常我们使用过去 52 周的最高 IV 值和最低 IV 作为波动率区间，如果需要计算短期波动率可以使用其他时间段，比如一些交易平台会支持 30 天、90 天、6 个月等等，简单来说 IVR 的主要是和统计区间的历史最高值和最低值去做比较，

以 AAPL 为例，计算以一年为区间，当前的 IV 值对应的 IVR，首先参考 AAPL 的历史波动率曲线。

<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div id="tradingview_b0716"  style="height:300px"></div>
  <div class="tradingview-widget-copyright"><a href="https://uk.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener" target="_blank"><span class="blue-text">AAPL Chart</span></a> by TradingView</div>
  <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
  <script type="text/javascript">
    new TradingView.widget({
      "autosize": true,
      "symbol": "NASDAQ:AAPL",
      "interval": "D",
      "timezone": "Asia/Hong_Kong",
      "theme": "light",
      "style": "2",
      "locale": "uk",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "hide_top_toolbar": true,
      "hide_legend": true,
      "save_image": false,
      "studies": [
        "HV@tv-basicstudies"
      ],
      "container_id": "tradingview_b0716"
    });
  </script>
</div>
<!-- TradingView Widget END -->

52 周 IV 最高出现在 2020 年 03 月的熔断，146.69% 左右，52 周最低出现在 2019 年 11 月，为 9.4%，以当前为基准，前推一年期的 IVR 计算公式为：

$$ IVR = \frac { IV_{ Current } − IV_{ 52LowestLow } }{ IV_{ 52HighestHigh } − IV_{ 52LowestLow} } \times 100 \% $$

2020 年 07 月 28 日，全天隐含波动率的平均值为 37.04%，代入公式计算：
 
$$ IV_{ Current } (0.3704) − IV_{ 52LowestLow } (.094) = 0.2764 $$ 

$$ IV_{ 52HighestHigh }(1.4669) − IV_{ 52LowestLow } (.094) = 1.3729 $$

$$ IV Rank = 0.2764/1.3729 = 0.2013 $$

计算得出的 20.13% 的 IV Rank 意味着当前的 IV 处于过去一整年波动率区间低位 20.13% 处，说明当前的 IV 非常接近 52 周历史低点。在极端的情况下，比如当前 IV 在 1 年内的历史最低点或历史最高点处时，此时的 IVR 会呈现为 0% 或 100%。

很显然 IVR 和 IVP 的值都在 0 到 1 之间，IVR 通常小于 IVP。两者的值越大，意味着此时 IV 相对历史水平来说更高，所以此时的期权价格也会更贵。由于数据统计复杂度的区别，部分刚接触这些指标的交易者会更青睐只需要统计最大最小值的 IVR，由于 IVR 没有统计意义上的算数平均和加权平均，所以当出现类似 3 月份 Volatility Spikes 的情况下，IV Rank 会出现一定的失真，事实上以 AAPL 为例，接近 40% 的 IV 值从主观角度很难说这是个非常低的 IV，所以在做决策时，IVR 和 IVP 应该作为同向指标一起参考，切忌将这两个指标分开分析，一切指标基于数学，切勿盲目遵循指标。

## 进一步了解

1. [IV Rank vs. IV Percentile](tastytradenetwork.squarespace.com/tt/blog/implied-volatility-rank-and-percentile)
2. [IVR and IVP: The Numbers](https://www.tastytrade.com/tt/shows/market-measures/episodes/ivr-and-ivp-the-numbers-08-30-2016)
