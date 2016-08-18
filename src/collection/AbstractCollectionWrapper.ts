import {ICollection} from './ICollection';
import {AbstractCollection} from './Collection';
import {IPredicate} from '../predicate/IPredicate';
import {IComparator} from '../comparator/IComparator';
import {IMapper} from '../mapper/IMapper';

export abstract class AbstractCollectionWrapper<TItem> extends AbstractCollection<TItem> {

    constructor(protected collection:ICollection<TItem>) {
        super();
    }

    /**
     * @override
     */
    public get length():number {
        return this.collection.length;
    }

    /**
     * @override
     */
    public get(index:number):TItem {
        return this.collection.get(index);
    }

    /**
     * @override
     */
    public add(item:TItem):ICollection<TItem> {
        return this.collection.add(item);
    }

    /**
     * @override
     */
    public addAll(items:ICollection<TItem>):ICollection<TItem> {
        return this.collection.addAll(items);
    }

    /**
     * @override
     */
    public removeAll():ICollection<TItem> {
        return this.collection.removeAll();
    }

    /**
     * @override
     */
    public remove(item:TItem):boolean {
        return this.collection.remove(item);
    }

    /**
     * @override
     */
    public filter(predicate:IPredicate<TItem>):ICollection<TItem> {
        return this.collection.filter(predicate);
    }

    /**
     * @override
     */
    public sort(comparator:IComparator<TItem>):ICollection<TItem> {
        return this.collection.sort(comparator);
    }

    /**
     * @override
     */
    public iterate(callback:(item:TItem, index:number)=>void, predicate?:IPredicate<TItem>) {
        this.collection.iterate(callback, predicate);
    }

    /**
     * @override
     */
    public map<E>(mapper:IMapper<TItem, E>):Array<E> {
        return this.collection.map<E>(mapper);
    }

    /**
     * @override
     */
    public getSize():number {
        return this.collection.getSize();
    }

    /**
     * @override
     */
    public toArray():Array<TItem> {
        return this.collection.toArray();
    }

    /**
     * @override
     */
    public addArray(items:Array<TItem>):ICollection<TItem> {
        return this.collection.addArray(items);
    }

    /**
     * @override
     */
    public find(predicate:IPredicate<TItem>):TItem {
        return this.collection.find(predicate);
    }

    /**
     * @override
     */
    public isEmpty():boolean {
        return this.collection.isEmpty();
    }

    /**
     * @override
     */
    public insert(position:number, item:TItem):ICollection<TItem> {
        return this.collection.insert(position, item);
    }

    /**
     * @override
     */
    public getIteratorInstance():Iterator<TItem> {
        return this.collection.getIteratorInstance();
    }
}
