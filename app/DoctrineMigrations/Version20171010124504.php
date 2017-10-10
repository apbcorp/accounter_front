<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171010124504 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE `document_accurring`
              ADD COLUMN `date` DATETIME NOT NULL,
              ADD COLUMN `unit_id` INT(11) UNSIGNED NOT NULL;
        ');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE `document_meter`
              DROP COLUMN `date`,
              DROP COLUMN `unit_id`;
        ');
    }
}
