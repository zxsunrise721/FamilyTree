
class Member{
    id;
    couple;
    children = [];
    constructor(id){
        this.id = id;
    }

    couple(coupleId){
        this.couple = new Member(coupleId);
        return this.couple
    }

    child( childId ){
        let child = new Member(childId);

    }

    getMember(){
        return {id: this.id, couple: this.couple, children: this.childred};
    }
}