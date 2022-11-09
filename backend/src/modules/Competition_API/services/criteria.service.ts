import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriteriaDto } from 'src/Dto/Competition/criteria.dto';
import { CriteriaCreateDto } from 'src/Dto/Competition/criteriaCreate.dto';
import { CriteriaUpdateDto } from 'src/Dto/Competition/criteriaUpdate.dto';
import { Competition } from 'src/models/Competition/competition.entity';
import { Repository } from 'typeorm';
import { CompetitionCriteria } from './../../../models/Competition/comCriteria.entity';

@Injectable()
export class CompetitionCriteriaService extends TypeOrmQueryService<CompetitionCriteria> {
  constructor(
    @InjectRepository(CompetitionCriteria)
    private criteriaRepo: Repository<CompetitionCriteria>,
    @InjectRepository(Competition)
    private competitionRepo: Repository<Competition>,
  ) {
    super(criteriaRepo);
  }

  async getAll(competitionId: number) {
    const allCrit = await this.criteriaRepo.find({
      where: { competition: { id: competitionId } },
      order: { createdAt: 'ASC' },
    });
    const result = this.processQueryResult(allCrit);
    return result;
  }

  processQueryResult(criteria: CriteriaDto[]): CriteriaUpdateDto[] {
    const result: CriteriaUpdateDto[] = [];
    //Add parents to result
    const parents = criteria.filter((criterion) => criterion.parentId === null);
    for (const parent of parents) {
      const newItem = { ...parent, children: [] };
      //Add children to result
      const childs = criteria.filter(
        (criterion) => criterion.parentId === newItem.id,
      );
      newItem.children = childs;
      result.push(newItem);
    }
    return result;
  }

  async update(criteria: CriteriaDto) {
    const newCrit = this.criteriaRepo.update(criteria.id, criteria);
    return newCrit;
  }

  async delete(id: string) {
    const result = this.criteriaRepo.delete(id);
    return result;
  }

  async save(criteria: CriteriaUpdateDto[], competitionId: number) {
    //save parent
    for (const criterion of criteria) {
      //If parent exist

      const parentCrit = await this.criteriaRepo.findOne(criterion.id);
      if (parentCrit !== undefined) {
        const updateData: CriteriaDto = {
          id: criterion.id,
          name: criterion.name,
          parentId: criterion.parentId,
          isCriteria: criterion.isCriteria,
          note: criterion.note,
          type: criterion.type,
          evidence: criterion.evidence,
          standardPoint: criterion.standardPoint,
          soft: criterion.soft,
        };
        await this.update(updateData);
        //Loop though child
        for (const childCrit of criterion.children) {
          this.saveChild(childCrit, parentCrit.id, competitionId);
        }
      } else {
        //If new --> create dad
        const newParentCrit = await this.criteriaRepo.create(criterion);
        newParentCrit.competition = this.competitionRepo.create({
          id: competitionId,
        });
        const parent = await this.criteriaRepo.save(newParentCrit);
        // loop through child
        for (const childCrit of criterion.children) {
          this.saveChild(childCrit, parent.id, competitionId);
        }
      }
    }
  }

  async saveChild(
    criterion: CriteriaDto,
    parentId: string,
    competitionId: number,
  ) {
    const crit = await this.criteriaRepo.findOne(criterion.id);
    if (crit !== undefined) {
      return await this.criteriaRepo.update(criterion.id, criterion);
    }
    const newCrit = await this.createChild(criterion, competitionId, parentId);
    return newCrit;
  }

  //
  async createDad(criteria: CriteriaCreateDto, competitionId: number) {
    const newCrit = await this.criteriaRepo.create(criteria);
    newCrit.competition = await this.competitionRepo.create({
      id: competitionId,
    });
    await this.criteriaRepo.save(newCrit);
    return newCrit;
  }
  async createChild(
    criteria: CriteriaDto,
    competitionId: number,
    parentId: string,
  ) {
    const newCrit = await this.criteriaRepo.create(criteria);
    newCrit.parentId = parentId;
    newCrit.competition = await this.competitionRepo.create({
      id: competitionId,
    });
    await this.criteriaRepo.save(newCrit);
    return newCrit;
  }
}
