# ts-collections

An implementation of collections using TypeScript.

## Description

The collections are implements basic functionality such as "find", "sort", "filter", "map", "decorate", etc.  

## Features  

1. Full compatibility with the [Angular2](https://angular.io) iterators, therefore you can use them inside the Angular2 templates.  
2. Full compatibility with the [lodash](https://lodash.com).  
3. Full compatibility with the [ES6 iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).  
4. Partial compatibility with the JavaScript Array (find/filter/forEach methods).  

## Installation

First you need to install the npm module:
```sh
npm install ts-collections --save
```

## Use

```typescript
let list:_.List<number> = Collections.emptyList<number>().add(100).add(50).add(200);
console.log(_(list).min()); // 50
```

**ProductsStore.ts**  
You can make the ProductsStore singleton the inheritor of collection and bind them into Angular2 template directly, then use ngFor.

```typescript
import {Injectable} from '@angular/core';

import {ArrayList} from 'ts-collections';
import {Product} from '../../model/Product';

@Injectable()
export class ProductsStore extends ArrayList<Product> {

    constructor() {
        super();
    }
}
```

```html
*ngFor="let product of productsStore"
```

**App.ts**
```typescript
import {
    ICollection,
    Collections,
} from 'ts-collections';

@Component({...})
export class App {
    
    private filteredDecoratedCollection:ICollection<string|number>;

    constructor() {
        const collection:ICollection<string> = Collections.emptyList<string>()
            .add("hello")
            .add("hello world");

        console.log('Collection size:', collection.getSize());                                                  // Collection size: 2

        this.filteredDecoratedCollection = Collections.makeDecoratedList<string, number>(collection, {
            decorate(item:string): number {
                return item.length;
            }
        }).filter({
            check: (wordLength:number) => {
                return wordLength > 5
            }
        });

        console.log('Filtered decorated collection size:', this.filteredDecoratedCollection.getSize());      // Filtered decorated collection size: 1
    }
}
```

**app.html**

Angular2 template
```html
<div *ngFor="let decoratedItem of filteredDecoratedCollection">
{{ decoratedItem }}
</div>
```

## Publish

```sh
npm deploy
```

## License

Licensed under MIT.