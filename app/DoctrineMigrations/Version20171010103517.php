<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171010103517 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE `document_meter` ADD COLUMN `unit_id` INT(11) UNSIGNED NOT NULL;
            ALTER TABLE `document_tarif` ADD COLUMN `unit_id` INT(11) UNSIGNED NOT NULL;
        ');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE `document_meter` DROP COLUMN `unit_id`;
            ALTER TABLE `document_tarif` DROP COLUMN `unit_id`;
        ');
    }
}
