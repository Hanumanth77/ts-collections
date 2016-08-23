import {IPredicate} from "../predicate/IPredicate";
import {IMapper} from '../mapper/IMapper';
import {IComparator} from '../comparator/IComparator';
import {IIteratorFactory} from './IIteratorFactory';

export interface ICollection<TItem> extends Iterable<TItem>, IIteratorFactory<TItem> {

    length: number;             // Lodash compatibility
    [index: number]: TItem;     // Lodash compatibility

    get(index:number):TItem;
    
    add(item:TItem):ICollection<TItem>;

    addAll(items:ICollection<TItem>):ICollection<TItem>;

    insert(position:number, item:TItem):ICollection<TItem>;

    removeAll():ICollection<TItem>;

    remove(item:TItem):boolean;
    
    filter(predicate:IPredicate<TItem>):ICollection<TItem>;

    sort(comparator:IComparator<TItem>):ICollection<TItem>;

    iterate(callback:(item:TItem, index:number) => void, predicate?:IPredicate<TItem>);

    map<E>(mapper:IMapper<TItem, E>):Array<E>;

    getSize():number;

    toArray():Array<TItem>;

    addArray(items:Array<TItem>):ICollection<TItem>;

    find(predicate:IPredicate<TItem>):TItem;

    isEmpty():boolean;
}
