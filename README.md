# ts-collections

An implementation of collections using TypeScript.

## Description

The collections are implements basic functionality such as "sort", "filter", "map", "decorate", etc.  
Full compatibility with the Angular2 iterators, therefore you can use them inside the Angular2 templates.

## Installation

First you need to install the npm module:
```sh
npm install ts-collections --save
```

## Use

**app.ts**
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