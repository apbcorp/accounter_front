<?php

namespace DocumentBundle\Controller;

use DocumentBundle\Entity\PayDocument;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Entity\Service;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use CoreBundle\Controller\BaseDocumentController;
use Symfony\Component\HttpFoundation\Response;

class PayController extends BaseDocumentController
{
    /**
     * @var string
     */
    protected $entity = PayDocument::class;

    /**
     * @Route("/pay/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function getAction($id)
    {
        return parent::getAction($id);
    }

    /**
     * @Route("/list/pay")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function listAction(Request $request)
    {
        return parent::listAction($request);
    }

    /**
     * @Route("/pay/delete/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function deleteAction($id)
    {
        return parent::deleteAction($id);
    }

    /**
     * @Route("/pay/{id}")
     * @Method("POST")
     * @var Request $request
     * @var int     $id
     * @return JsonResponse
     */
    public function patchAction(Request $request, $id)
    {
        return parent::patchAction($request, $id);
    }

    /**
     * @Route("/pay")
     * @Method("POST")
     * @var Request $request
     * @return JsonResponse
     */
    public function postAction(Request $request)
    {
        return parent::postAction($request);
    }

    /**
     * @Route("/fill_pays")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function getDebtAction(Request $request)
    {
        $date = new \DateTime($request->get('date'));
        $kontragentId = $request->get('kontragentId');
        $kontragent = $this->getDoctrine()->getManager()->getRepository(Kontragent::class)->find($kontragentId);

        if (!$date || !$kontragent) {
            return $this->sendResponse([], Response::HTTP_BAD_REQUEST);
        }

        $generator = $this->get('document.generator.debt');

        return $this->sendResponse($generator->getDebtByKontragent($date, $kontragent), Response::HTTP_OK);
    }
}