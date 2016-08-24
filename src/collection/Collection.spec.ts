import {ICollection} from './ICollection';
import {Collections} from './Collections';

describe('Collection', ()=> {

    describe('Checking the filter method of collection', ()=> {

        it('Collection must successfully filter the input elements', ()=> {

            const list:ICollection<number> = Collections.emptyList<number>()
                .add(100)
                .add(200)
                .add(300)
                .add(400)
                .filter((item:number) => item > 200);


            expect(list.get(0)).toEqual(300);
            expect(list.get(1)).toEqual(400);
            expect(list.getSize()).toEqual(2);

            // lodash
            expect(list[0]).toEqual(300);
            expect(list[1]).toEqual(400);
        });
    });

    describe('Checking the find method of collection', ()=> {

        it('Collection must successfully find the input element', ()=> {

            class User {

                constructor(private id:number) {
                }

                getId():number {
                    return this.id
                }
            }

            let thirdUser:User;
            const list:ICollection<User> = Collections.emptyList<User>()
                .add(new User(100))
                .add(new User(200))
                .add(thirdUser = new User(300))
                .add(new User(400));


            expect(list.find((user:User) => user.getId() === 300)).toEqual(thirdUser);
            expect(list.find({
                check: (user:User) => user.getId() === 300
            })).toEqual(thirdUser);
        });
    });

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
