# knockout postal smartcart
#### yet another knockout demonstration .. but WHY??
Knockout has been around for years and years, so also has MV*; this a new flavor MVServiceChannel where all data flows directly out of the view models via postal.js channels, connecting independent components with little effort, very similar to *the difference between wired and wireless communication*.

### using knockout page
  1. build `npm run bundle`
  2. dev server `npm run dev`
### using polymer page (will be changed to use same commands for both in future)
  1. polymer server
  2. polymer build

### Emerging Patterns
1. Using the view constructor to initialize subscriptions. Of course, one could initialize subscriptions after view model interations via event-binding or with observables. 
2. *Thin view models*: their activities fall in to two categories: a) updating view models from subscription data arriving from services; b) publishing data back to services. In the end, no data resides in the view except for by reference from the services. This way, requests for paging a filtering -- for example -- can be initiated from separate components that don't know anything about eachother without the need for a controller, making them completely context independent.


