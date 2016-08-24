import {ICollection} from './ICollection';
import {IPredicate, IPredicateFunction} from '../predicate/IPredicate';
import {IMapper} from '../mapper/IMapper';
import {IComparator} from '../comparator/IComparator';
import {DefaultMapper} from '../mapper/DefaultMapper';

// TODO increase capacity at runtime
const INITIAL_CAPACITY:number = 10000;

export abstract class AbstractCollection<TItem> implements ICollection<TItem> {

    /**
     * Lodash compatibility
     * @override
     */
    length: number;

    /**
     * Lodash compatibility
     * @override
     */
    [index: number]: TItem;

    /**
     * ES6 iterators compatibility
     * @override
     */
    [Symbol.iterator] = this.iterator();

    /**
     * @override
     */
    public iterator():()=>Iterator<TItem> {
        return () => {
            return this.getIteratorInstance();
        };
    }

    abstract getIteratorInstance():Iterator<TItem>;

    abstract addAll(items:ICollection<TItem>):ICollection<TItem>;

    abstract get(index:number):TItem;

    abstract insert(position:number, item:TItem):ICollection<TItem>;

    abstract add(item:TItem):ICollection<TItem>;

    abstract getSize():number;

    abstract remove(item:TItem):boolean;

    abstract removeAll():ICollection<TItem>;

    abstract sort(comparator:IComparator<TItem>):ICollection<TItem>;

    /**
     * Compatible with an array
     */
    abstract filter(predicate:IPredicate<TItem>|IPredicateFunction<TItem>):ICollection<TItem>;

    abstract iterate(callback:(item:TItem, index:number) => void, predicate?:IPredicate<TItem>);

    abstract map<E>(mapper:IMapper<TItem, E>):Array<E>;

    abstract toArray():Array<TItem>;

    abstract addArray(items:Array<TItem>):ICollection<TItem>;

    /**
     * Compatible with an array
     */
    abstract find(predicate:IPredicate<TItem>|IPredicateFunction<TItem>):TItem;

    abstract isEmpty():boolean;
}

export abstract class Collection<TItem> extends AbstractCollection<TItem> {

    constructor() {
        super();
    }

    /**
     * @override
     */
    public iterate(callback:(item:TItem, index:number) => void, predicate?:IPredicate<TItem>|IPredicateFunction<TItem>) {
        for (let iterator:Iterator<TItem> = this.iterator()(),
                 iteratorResult:IteratorResult<TItem> = iterator.next(),
                 index = 0;
             !iteratorResult.done;
             iteratorResult = iterator.next()) {

            const value:TItem = iteratorResult.value;

            if (!predicate || this.isSuitable(value, predicate)) {
                if (callback.call(this, value, index++) === false) {
                    return;
                }
            }
        }
    }

    /**
     * @override
     */
    public addAll(items:ICollection<TItem>):ICollection<TItem> {
        items.iterate((item:TItem) => this.add(item));
        return this;
    }

    /**
     * Compatible with an array
     * @override
     */
    public filter(predicate:IPredicate<TItem>|IPredicateFunction<TItem>):ICollection<TItem> {
        const filteredCollection:ICollection<TItem> = this.newInstance();

        this.iterate((o:TItem) => filteredCollection.add(o), predicate);
        return filteredCollection;
    }

    /**
     * @override
     */
    public map<E>(mapper:IMapper<TItem, E>):Array<E> {
        const ids:Array<E> = [];
        this.iterate((item:TItem) => ids.push(mapper.map(item)));
        return ids;
    }

    /**
     * @override
     */
    public toArray():Array<TItem> {
        return this.map(new DefaultMapper<TItem>());
    }

    /**
     * @override
     */
    public addArray(items:Array<TItem>):ICollection<TItem> {
        items.forEach((item:TItem) => this.add(item));
        return this;
    }

    /**
     * Compatible with an array
     * @override
     */
    public find(predicate:IPredicate<TItem>|IPredicateFunction<TItem>):TItem {
        let result:TItem = null;
        this.iterate((item:TItem) => {
            if (this.isSuitable(item, predicate)) {
                result = item;
                return false;
            }
            return true;
        });
        return result;
    }

    /**
     * @override
     */
    public isEmpty():boolean {
        return !this.getSize();
    }

    /**
     * @override
     */
    public get length():number {
        return this.getSize();
    }

    protected newInstance():ICollection<TItem> {
        return new (<any>this.constructor);
    }

    private isSuitable(value:TItem, predicate:IPredicate<TItem>|IPredicateFunction<TItem>):boolean {
        return typeof predicate === 'function'
            ? (predicate as IPredicateFunction<TItem>)(value)
            : (predicate as IPredicate<TItem>).check(value);
    }
}

(() => {
    /**
     * Lodash support. We can't define the index property at the runtime because too low performance.
     */
    for (let i = 0; i < INITIAL_CAPACITY; i++) {
        ((index:number) => Object.defineProperty(Collection.prototype, index.toString(), {
            get: function () {
                return this.get(index);
            }
        }))(i);
    }
})();
