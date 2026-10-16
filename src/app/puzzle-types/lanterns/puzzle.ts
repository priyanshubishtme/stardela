import type { Difficulty, difficulty } from "../../../shared/difficulty"
export type LanternState = "lit" | "dark";
export type LanternCategory = 
|"science"
|"technology"
|"history"
|"random"
|"mythological"
|"mathematics"
|"current-affairs"
|"general"
|"logic";

// Statement type supported by the game
export type LanternStatementType = "independent" | "connected";
export interface Lantern {
    readonly id: string;
    readonly category: LanternCategory;
    readonly difficulty: Difficulty;
    readonly statement: string;
    readonly statementType: LanternStatementType;
    readonly correctState: LanternState;
    readonly explanation: string;
    
// Id of the lantern referred by a connected account 
readonly relatedLanternId?: string;

};

export interface LanternPuzzle{
    readonly id: string;
    readonly type: "lanterns";
    readonly difficulty: Difficulty;
    readonly lanterns: readonly Lantern[];
    readonly selectionCount: number;
    readonly passingPercentage: number;
}

export const LANTERNS_PER_BANK = 20;
export const LANTERNS_PER_CHALLENGE = 10;
export const PASSING_PERCENTAGE= 70;

export function getPassingScore(
    selectionCount: number,
    passingPercentage: number = PASSING_PERCENTAGE,):number{
        return Math.ceil((selectionCount * passingPercentage)/100);
    }

export function validateLanternBank()
{
    lanterns: readonly Lantern[],
): {valid: Boolean; error{s: string[]
}
{
    const errors: string[] = [];
    const ids = new Set<string>();
}

if(LANTERNS_PER_BANK.length !== LANTERNS_PER_BANK){
    errors.push(
        'Expected ${LANTERS_PER_BANK'} LANTERNS_PER_BANK, received ${LANTERNS_PER_BANK.length}.',
    );
    
}

for (const lantern of lanterns)
{
    if(isDifficulty.has(lantern.id)){
        errors.push('Duplicate Lantern ID: $')
    }
    thi
}