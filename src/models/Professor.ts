import type { ProfessorDTO, User, Institution } from '../types/entities';

export class Professor {
    public id: string;
    public user: Partial<User>; // More flexible
    public institution?: Institution;

    constructor(data: ProfessorDTO) {
        if (!data) {
            // Handle cases where data might be null or undefined
            this.id = '';
            this.user = {};
            return;
        }

        this.id = data.id;
        this.institution = data.institution;

        if (data.user) {
            this.user = data.user;
        } else {
            // Reconstruct a partial user from DTO's top-level properties
            this.user = {
                name: data.name,
                surname: data.surname,
                profile_picture: data.profilePicture,
            };
        }
    }

    get fullName(): string {
        return `${this.user.name || ''} ${this.user.surname || ''}`.trim();
    }

    get profilePicture(): string {
        return this.user.profile_picture || '/img/noImage.jpg';
    }

    get email(): string {
        return this.user.mail || ''; // Return empty string if mail is not available
    }

    get initials(): string {
        const firstInitial = this.user.name?.charAt(0).toUpperCase() || '';
        const lastInitial = this.user.surname?.charAt(0).toUpperCase() || '';
        return `${firstInitial}${lastInitial}`;
    }

    belongsToInstitution(institutionId: string): boolean {
        return !!this.institution && (this.institution.id === institutionId || this.institution.institutionId === institutionId);
    }
}