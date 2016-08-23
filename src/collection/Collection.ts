import {ICollection} from './ICollection';
import {IPredicate} from '../predicate/IPredicate';
import {IMapper} from '../mapper/IMapper';
import {IComparator} from '../comparator/IComparator';

// TODO increase capacity at runtime
const INITIAL_CAPACITY:number = 10000;

export abstract class AbstractCollection<TItem> implements ICollection<TItem> {

    /**
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

    abstract filter(predicate:IPredicate<TItem>):ICollection<TItem>;

    abstract iterate(callback:(item:TItem, index:number) => void, predicate?:IPredicate<TItem>);

    abstract map<E>(mapper:IMapper<TItem, E>):Array<E>;

    abstract toArray():Array<TItem>;

    abstract addArray(items:Array<TItem>):ICollection<TItem>;

    abstract find(predicate:IPredicate<TItem>):TItem;

    abstract isEmpty():boolean;

    length:number;
}

export abstract class Collection<TItem> extends AbstractCollection<TItem> {

    constructor() {
        super();
    }

    /**
     * @override
     */
    public iterate(callback:(item:TItem, index:number) => void, predicate?:IPredicate<TItem>) {
        for (let iterator:Iterator<TItem> = this.iterator()(),
                 iteratorResult:IteratorResult<TItem> = iterator.next(),
                 index = 0;
             !iteratorResult.done;
             iteratorResult = iterator.next()) {

            const value:TItem = iteratorResult.value;

            if (!predicate || predicate.check(value)) {
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
     * @override
     */
    public filter(predicate:IPredicate<TItem>):ICollection<TItem> {
        const filteredCollection:ICollection<TItem> = this.newInstance();

        this.iterate((o:TItem) => {
            filteredCollection.add(o);
        }, predicate);
        return filteredCollection;
    }

    /**
     * @override
     */
    public map<E>(mapper:IMapper<TItem, E>):Array<E> {
        const ids:Array<E> = [];
        this.iterate((o:TItem) => {
            ids.push(mapper.map(o));
        });
        return ids;
    }

    /**
     * @override
     */
    public toArray():Array<TItem> {
        const ids:Array<TItem> = [];
        this.iterate((o:TItem) => ids.push(o));
        return ids;
    }

    /**
     * @override
     */
    public addArray(items:Array<TItem>):ICollection<TItem> {
        items.forEach((item:TItem) => this.add(item));
        return this;
    }

    /**
     * @override
     */
    public find(predicate:IPredicate<TItem>):TItem {
        let result:TItem = null;
        this.iterate((o:TItem) => {
            if (predicate.check(o)) {
                result = o;
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
}

for (let i = 0; i < INITIAL_CAPACITY; i++) {
    (function (index) {
        Object.defineProperty(Collection, index, {
            get: function () {
                return this.get(index);
            }
        })
    })(i);
}
