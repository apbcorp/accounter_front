<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171027094049 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE `document_meters_service_row` ADD COLUMN `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE `document_meters_service_row` DROP COLUMN `date`
        ');

    }
}
