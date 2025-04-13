import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./models/user.entity";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async findById(id: number) {
        return await this.userRepository.findOneBy({
            id: id
        });
    }
    
    async findByEmail(email: string) {
        return await this.userRepository.findOneBy({
            email: email
        });
    }

    async findByPhone(phone: string) {
        return await this.userRepository.findOneBy({
            phone: phone
        });
    }

    async save(user: User) {
        return await this.userRepository.save(user);
    }

    async delete(id: number) {
        return await this.userRepository.delete(id);
    }

} 