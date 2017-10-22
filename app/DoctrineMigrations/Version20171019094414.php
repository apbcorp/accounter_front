<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171019094414 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE `ground` MODIFY `number` VARCHAR(255) NULL;
            ALTER TABLE `ground` MODIFY `line` VARCHAR(255) NULL;
            ALTER TABLE `ground` MODIFY `ground_number` VARCHAR(255) NULL;
        ');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE `ground` MODIFY `number` VARCHAR(255) NOT NULL;
            ALTER TABLE `ground` MODIFY `line` VARCHAR(255) NOT NULL;
            ALTER TABLE `ground` MODIFY `ground_number` VARCHAR(255) NOT NULL;
        ');
    }
}
