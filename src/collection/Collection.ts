import {ICollection} from './ICollection';
import {IPredicate, IPredicateFunction} from '../predicate/IPredicate';
import {IMapper} from '../mapper/IMapper';
import {IComparator} from '../comparator/IComparator';
import {DefaultMapper} from '../mapper/DefaultMapper';

const $$TS_COLLECTIONS_INITIAL_CAPACITY:string = '$$TS_COLLECTIONS_INITIAL_CAPACITY';
const $$TS_COLLECTIONS_CAPACITY_GROW_FACTOR:string = '$$TS_COLLECTIONS_CAPACITY_GROW_FACTOR';

export const INITIAL_CAPACITY:number = typeof window !== 'undefined' && window[$$TS_COLLECTIONS_INITIAL_CAPACITY]
    ? parseInt(window[$$TS_COLLECTIONS_INITIAL_CAPACITY])
    : 10000;

export const CAPACITY_GROW_FACTOR:number = typeof window !== 'undefined' && window[$$TS_COLLECTIONS_CAPACITY_GROW_FACTOR]
    ? parseInt(window[$$TS_COLLECTIONS_CAPACITY_GROW_FACTOR])
    : 0.05;

/**
 * Lodash support.
 */
function defineIndexProperties(object, start:number, end:number) {
    const properties:PropertyDescriptorMap = {} as PropertyDescriptorMap;
    for (let i = start; i < end; i++) {
        ((index:number) => properties[index.toString()] = {
            get: function () {
                return this.get(index);
            }
        })(i);
    }
    Object.defineProperties(object, properties);
}

export abstract class AbstractCollection<TItem> implements ICollection<TItem> {

    private currentCapacity:number = INITIAL_CAPACITY;

    /**
     * Lodash compatibility
     * @override
     */
    length:number;

    /**
     * Lodash compatibility
     * @override
     */
    [index:number]:TItem;

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

    /**
     * @override
     */
    public insert(position:number, item:TItem):ICollection<TItem> {
        this.checkAndGrowUp();
        return this;
    }

    /**
     * @override
     */
    public addArray(items:Array<TItem>):ICollection<TItem> {
        this.checkAndGrowUp();
        return this;
    }

    protected checkAndGrowUp() {
        if (this.length > this.currentCapacity) {
            const previousCapacity:number = this.currentCapacity;

            defineIndexProperties(
                this,
                previousCapacity,
                this.currentCapacity = previousCapacity + Math.round(this.length * CAPACITY_GROW_FACTOR)
            );
        }
    }

    abstract getIteratorInstance():Iterator<TItem>;

    abstract addAll(items:ICollection<TItem>):ICollection<TItem>;

    abstract get(index:number):TItem;

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

(() => defineIndexProperties(Collection.prototype, 0, INITIAL_CAPACITY))();
