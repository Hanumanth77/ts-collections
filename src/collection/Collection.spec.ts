import {ICollection} from './ICollection';
import {Collections} from './Collections';

describe('Collection', ()=> {

    describe('Checking the decorated collection', ()=> {

        it('Decorated collection must successfully decorate and filter the input elements', ()=> {

            const list:ICollection<string> = Collections.emptyList<string>()
                .add("hello")
                .add("hello world");

            const array:Array<number> = [list.get(0).length, list.get(1).length];

            let filteredListSize:number = 0;

            const filteredDecoratedCollection:ICollection<string|number> = Collections.makeDecoratedList<string, number>(list, {
                decorate(item:string): number {
                    return item.length;
                }
            }).filter({
                check: (wordLength:number) => {
                    return wordLength > 5
                }
            });

            filteredDecoratedCollection.iterate((decoratedItem:number) => {
                expect(decoratedItem).toEqual(array[1]);
                filteredListSize++;
            });

            expect(filteredListSize).toEqual(1);
            expect(filteredDecoratedCollection.getSize()).toEqual(1);
        });
    });
});
