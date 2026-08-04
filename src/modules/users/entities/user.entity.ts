import { UserRole } from "@/enums/user-role.enum";
import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User  {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;
 
    @Column({unique:true})
    employee_code: string;
    
    @Column({
        type:"enum",
        enum: UserRole,
        default:UserRole.USER
    })
    role:UserRole

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    password_hash: string;
}
