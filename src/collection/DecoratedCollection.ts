import {ICollection} from './ICollection';
import {Collection} from './Collection';
import {IItemDecorator} from './IItemDecorator';
import {IComparator} from '../comparator/IComparator';

export class DecoratedCollection<TItem, TDecoratedItem> extends Collection<TItem|TDecoratedItem> {

    constructor(protected collection:ICollection<TItem>, protected itemDecorator:IItemDecorator<TItem, TDecoratedItem>) {
        super();
    }

    /**
     * Decorated iterator for original collection
     *
     * @override
     */
    public getIteratorInstance():Iterator<TItem|TDecoratedItem> {
        const iterator:Iterator<TItem> = this.collection.getIteratorInstance();

        return {
            next: ():IteratorResult<TDecoratedItem> => {
                const iteratorResult:IteratorResult<TItem> = iterator.next();
                return {
                    done: iteratorResult.done,
                    value: !iteratorResult.done ? this.itemDecorator.decorate(iteratorResult.value) : null
                };
            }
        };
    }

    /**
     * Get decorated item
     *
     * @override
     */
    public get(index:number):TDecoratedItem {
        return this.itemDecorator.decorate(this.collection.get(index));
    }

    /**
     * Make clone of the original collection
     *
     * @override
     */
    protected newInstance():ICollection<TItem> {
        return new (<any>this.collection.constructor);
    }

    /**
     * Sort original collection
     *
     * @override
     */
    public sort(comparator:IComparator<TItem>):ICollection<TItem> {
        return this.collection.sort(comparator);
    }

    /**
     * Get size of original collection
     *
     * @override
     */
    public getSize():number {
        return this.collection.getSize();
    }

    /**
     * Add an element to original collection
     *
     * @override
     */
    public add(item:TItem):ICollection<TItem> {
        return this.collection.add(item);
    }

    /**
     * Insert element into original collection
     *
     * @override
     */
    public insert(position:number, item:TItem):ICollection<TItem> {
        return this.collection.insert(position, item);
    }

    /**
     * Remove the all elements from original collection
     *
     * @override
     */
    public removeAll():ICollection<TItem> {
        return this.collection.removeAll();
    }

    /**
     * Remove an element from original collection
     *
     * @override
     */
    public remove(item:TItem):boolean {
        return this.collection.remove(item);
    }
}
